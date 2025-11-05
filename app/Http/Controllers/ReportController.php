<?php
// app/Http/Controllers/ReportController.php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Project;
use App\Models\FundDayContribution;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        // Check if we have report data in session (from PRG pattern)
        $reportData = session('reportData');

        return Inertia::render('Reports/Index', [
            'reportData' => $reportData,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:summary,mitupo,contributor_type,monthly,detailed,projects,fund_day,combined',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'data_source' => 'required|in:contributions,projects,fund_day,all',
        ]);

        $user = Auth::user();
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $dataSource = $request->data_source;

        $data = [];

        switch ($request->report_type) {
            case 'summary':
                $data = $this->generateSummaryReport($user, $startDate, $endDate, $dataSource);
                break;
            case 'mitupo':
                if ($dataSource === 'contributions' || $dataSource === 'all') {
                    $data = $this->generateMitupoReport($user, $startDate, $endDate);
                }
                break;
            case 'contributor_type':
                if ($dataSource === 'contributions' || $dataSource === 'all') {
                    $data = $this->generateContributorTypeReport($user, $startDate, $endDate);
                }
                break;
            case 'monthly':
                $data = $this->generateMonthlyReport($user, $startDate, $endDate, $dataSource);
                break;
            case 'detailed':
                $data = $this->generateDetailedReport($user, $startDate, $endDate, $dataSource);
                break;
            case 'projects':
                $data = $this->generateProjectsReport($user, $startDate, $endDate);
                break;
            case 'fund_day':
                $data = $this->generateFundDayReport($user, $startDate, $endDate);
                break;
            case 'combined':
                $data = $this->generateCombinedReport($user, $startDate, $endDate);
                break;
        }

        // Store report data in session and redirect (PRG pattern)
        session()->flash('reportData', [
            'report_type' => $request->report_type,
            'data_source' => $dataSource,
            'start_date'  => $startDate,
            'end_date'    => $endDate,
            'data'        => $data,
            'filters'     => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
                'data_source' => $dataSource,
            ]
        ]);

        return redirect()->route('reports.index');
    }

    public function export(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:summary,mitupo,contributor_type,monthly,detailed,projects,fund_day,combined',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'data_source' => 'required|in:contributions,projects,fund_day,all',
            'format' => 'required|in:csv,pdf',
        ]);

        try {
            $user = Auth::user();
            $reportData = $this->generateReportData(
                $request->report_type,
                $request->start_date,
                $request->end_date,
                $request->data_source,
                $user
            );

            $filename = $this->generateFilename($request->report_type, $request->format, $request->data_source);

            if ($request->format === 'csv') {
                return $this->exportToCsv($reportData, $filename, $request->report_type, $request->data_source);
            }

            return $this->exportToPdf($reportData, $filename);
        } catch (Exception $e) {
            Log::error('Export failed: ' . $e->getMessage());
            return back()->withErrors(['export' => 'Failed to export report: ' . $e->getMessage()]);
        }
    }

    private function generateSummaryReport($user, $startDate, $endDate, $dataSource)
    {
        $data = [];

        if ($dataSource === 'contributions' || $dataSource === 'all') {
            $contributionsQuery = $this->getBaseQuery(Contribution::class, $user, $startDate, $endDate);
            $contributionsData = $this->getContributionSummary($contributionsQuery);
            $data['contributions'] = $contributionsData;
        }

        if ($dataSource === 'projects' || $dataSource === 'all') {
            $projectsQuery = $this->getBaseQuery(Project::class, $user, $startDate, $endDate);
            $projectsData = $this->getProjectSummary($projectsQuery);
            $data['projects'] = $projectsData;
        }

        if ($dataSource === 'fund_day' || $dataSource === 'all') {
            $fundDayQuery = $this->getBaseQuery(FundDayContribution::class, $user, $startDate, $endDate);
            $fundDayData = $this->getFundDaySummary($fundDayQuery);
            $data['fund_day'] = $fundDayData;
        }

        if ($dataSource === 'all') {
            $data['combined'] = $this->getCombinedSummary($data);
        }

        return $data;
    }

    private function generateMitupoReport($user, $startDate, $endDate)
    {
        $query = $this->getBaseQuery(Contribution::class, $user, $startDate, $endDate)
            ->with('mutupo');

        return $query->select([
            'mutupo_id',
            DB::raw('COUNT(*) as contributor_count'),
            DB::raw('SUM(total_contributed) as total_amount'),
            DB::raw('SUM(no_of_tshirts) as total_tshirts'),
            DB::raw('SUM(no_of_cement_bags) as total_cement_bags'),
            DB::raw('AVG(total_contributed) as average_contribution'),
        ])
            ->groupBy('mutupo_id')
            ->get()
            ->map(function ($item) {
                return [
                    'mutupo_name' => $item->mutupo->name,
                    'contributor_count' => $item->contributor_count,
                    'total_amount' => (float) $item->total_amount,
                    'total_tshirts' => $item->total_tshirts,
                    'total_cement_bags' => $item->total_cement_bags,
                    'average_contribution' => (float) $item->average_contribution,
                ];
            })->toArray();
    }

    private function generateContributorTypeReport($user, $startDate, $endDate)
    {
        $query = $this->getBaseQuery(Contribution::class, $user, $startDate, $endDate)
            ->with('contributorType');

        return $query->select([
            'contributor_type_id',
            DB::raw('COUNT(*) as contributor_count'),
            DB::raw('SUM(total_contributed) as total_amount'),
            DB::raw('AVG(total_contributed) as average_contribution'),
        ])
            ->groupBy('contributor_type_id')
            ->get()
            ->map(function ($item) {
                return [
                    'contributor_type' => $item->contributorType->name,
                    'contributor_count' => $item->contributor_count,
                    'total_amount' => (float) $item->total_amount,
                    'average_contribution' => (float) $item->average_contribution,
                ];
            })->toArray();
    }

    private function generateMonthlyReport($user, $startDate, $endDate, $dataSource)
    {
        $data = [];

        if ($dataSource === 'contributions' || $dataSource === 'all') {
            $contributionsQuery = $this->getBaseQuery(Contribution::class, $user, $startDate, $endDate);
            $data['contributions'] = $this->getMonthlyData($contributionsQuery, 'contributions');
        }

        if ($dataSource === 'projects' || $dataSource === 'all') {
            $projectsQuery = $this->getBaseQuery(Project::class, $user, $startDate, $endDate);
            $data['projects'] = $this->getMonthlyData($projectsQuery, 'projects');
        }

        if ($dataSource === 'fund_day' || $dataSource === 'all') {
            $fundDayQuery = $this->getBaseQuery(FundDayContribution::class, $user, $startDate, $endDate);
            $data['fund_day'] = $this->getMonthlyData($fundDayQuery, 'fund_day');
        }

        return $data;
    }

    private function generateDetailedReport($user, $startDate, $endDate, $dataSource)
    {
        $data = [];

        if ($dataSource === 'contributions' || $dataSource === 'all') {
            $contributionsQuery = $this->getBaseQuery(Contribution::class, $user, $startDate, $endDate)
                ->with(['mutupo', 'contributorType']);
            $data['contributions'] = $contributionsQuery->get()->map(function ($contribution) {
                return [
                    'type' => 'contribution',
                    'contributor_name' => $contribution->contributor_name,
                    'mutupo' => $contribution->mutupo->name,
                    'contributor_type' => $contribution->contributorType->name,
                    'no_of_tshirts' => $contribution->no_of_tshirts,
                    'tshirt_amount' => (float) $contribution->tshirt_amount,
                    'no_of_cement_bags' => $contribution->no_of_cement_bags,
                    'cement_amount' => (float) $contribution->cement_amount,
                    'total_contributed' => (float) $contribution->total_contributed,
                    'created_at' => $contribution->created_at->format('Y-m-d H:i:s'),
                ];
            })->toArray();
        }

        if ($dataSource === 'projects' || $dataSource === 'all') {
            $projectsQuery = $this->getBaseQuery(Project::class, $user, $startDate, $endDate)
                ->with('user');
            $data['projects'] = $projectsQuery->get()->map(function ($project) {
                return [
                    'type' => 'project',
                    'name' => $project->name,
                    'description' => $project->description,
                    'project_cost' => (float) $project->project_cost,
                    'revenue' => (float) $project->revenue,
                    'profit' => (float) $project->profit,
                    'added_by' => $project->user->name,
                    'created_at' => $project->created_at->format('Y-m-d H:i:s'),
                ];
            })->toArray();
        }

        if ($dataSource === 'fund_day' || $dataSource === 'all') {
            $fundDayQuery = $this->getBaseQuery(FundDayContribution::class, $user, $startDate, $endDate)
                ->with('user');
            $data['fund_day'] = $fundDayQuery->get()->map(function ($contribution) {
                return [
                    'type' => 'fund_day',
                    'contributor_name' => $contribution->contributor_name,
                    'cement_bags' => $contribution->cement_bags,
                    'cement_amount' => (float) $contribution->cement_amount,
                    'total_contributed' => (float) $contribution->total_contributed,
                    'added_by' => $contribution->user->name,
                    'created_at' => $contribution->created_at->format('Y-m-d H:i:s'),
                ];
            })->toArray();
        }

        return $data;
    }

    private function generateProjectsReport($user, $startDate, $endDate)
    {
        $query = $this->getBaseQuery(Project::class, $user, $startDate, $endDate)
            ->with('user');

        return $query->get()->map(function ($project) {
            return [
                'name' => $project->name,
                'description' => $project->description,
                'project_cost' => (float) $project->project_cost,
                'revenue' => (float) $project->revenue,
                'profit' => (float) $project->profit,
                'profit_margin' => $project->revenue > 0 ? (($project->profit / $project->revenue) * 100) : 0,
                'added_by' => $project->user->name,
                'created_at' => $project->created_at->format('Y-m-d H:i:s'),
            ];
        })->toArray();
    }

    private function generateFundDayReport($user, $startDate, $endDate)
    {
        $query = $this->getBaseQuery(FundDayContribution::class, $user, $startDate, $endDate)
            ->with('user');

        return $query->get()->map(function ($contribution) {
            return [
                'contributor_name' => $contribution->contributor_name,
                'cement_bags' => $contribution->cement_bags,
                'cement_amount' => (float) $contribution->cement_amount,
                'total_contributed' => (float) $contribution->total_contributed,
                'added_by' => $contribution->user->name,
                'created_at' => $contribution->created_at->format('Y-m-d H:i:s'),
            ];
        })->toArray();
    }

    private function generateCombinedReport($user, $startDate, $endDate)
    {
        $contributionsQuery = $this->getBaseQuery(Contribution::class, $user, $startDate, $endDate);
        $projectsQuery = $this->getBaseQuery(Project::class, $user, $startDate, $endDate);
        $fundDayQuery = $this->getBaseQuery(FundDayContribution::class, $user, $startDate, $endDate);

        $contributionsTotal = $contributionsQuery->sum('total_contributed');
        $projectsProfit = $projectsQuery->sum('profit');
        $fundDayTotal = $fundDayQuery->sum('total_contributed');

        return [
            'contributions_total' => (float) $contributionsTotal,
            'projects_profit' => (float) $projectsProfit,
            'fund_day_total' => (float) $fundDayTotal,
            'grand_total' => (float) ($contributionsTotal + $projectsProfit + $fundDayTotal),
            'contributions_count' => $contributionsQuery->count(),
            'projects_count' => $projectsQuery->count(),
            'fund_day_count' => $fundDayQuery->count(),
            'total_records' => $contributionsQuery->count() + $projectsQuery->count() + $fundDayQuery->count(),
        ];
    }

    // Helper methods
    private function getBaseQuery($model, $user, $startDate, $endDate)
    {
        $query = $model::query();

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        return $query;
    }

    private function getContributionSummary($query)
    {
        $totalContributions = $query->count();
        $totalAmount = $query->sum('total_contributed');
        $totalTshirts = $query->sum('no_of_tshirts');
        $totalCementBags = $query->sum('no_of_cement_bags');
        $avgContribution = $totalContributions > 0 ? $totalAmount / $totalContributions : 0;

        return [
            'total_contributors' => $totalContributions,
            'total_amount' => (float) $totalAmount,
            'total_tshirts' => $totalTshirts,
            'total_cement_bags' => $totalCementBags,
            'average_contribution' => (float) $avgContribution,
            'tshirt_revenue' => $totalTshirts * 7,
            'cement_revenue' => (float) $query->sum('cement_amount'),
        ];
    }

    private function getProjectSummary($query)
    {
        $totalProjects = $query->count();
        $totalCost = $query->sum('project_cost');
        $totalRevenue = $query->sum('revenue');
        $totalProfit = $query->sum('profit');
        $avgProfit = $totalProjects > 0 ? $totalProfit / $totalProjects : 0;

        return [
            'total_projects' => $totalProjects,
            'total_cost' => (float) $totalCost,
            'total_revenue' => (float) $totalRevenue,
            'total_profit' => (float) $totalProfit,
            'average_profit' => (float) $avgProfit,
            'profit_margin' => $totalRevenue > 0 ? ($totalProfit / $totalRevenue) * 100 : 0,
        ];
    }

    private function getFundDaySummary($query)
    {
        $totalContributions = $query->count();
        $totalAmount = $query->sum('total_contributed');
        $totalCementBags = $query->sum('cement_bags');
        $avgContribution = $totalContributions > 0 ? $totalAmount / $totalContributions : 0;

        return [
            'total_contributors' => $totalContributions,
            'total_amount' => (float) $totalAmount,
            'total_cement_bags' => $totalCementBags,
            'average_contribution' => (float) $avgContribution,
        ];
    }

    private function getCombinedSummary($data)
    {
        $contributions = $data['contributions'] ?? [];
        $projects = $data['projects'] ?? [];
        $fundDay = $data['fund_day'] ?? [];

        return [
            'total_contributions_amount' => $contributions['total_amount'] ?? 0,
            'total_projects_profit' => $projects['total_profit'] ?? 0,
            'total_fund_day_amount' => $fundDay['total_amount'] ?? 0,
            'grand_total' => ($contributions['total_amount'] ?? 0) + ($projects['total_profit'] ?? 0) + ($fundDay['total_amount'] ?? 0),
            'total_records' => ($contributions['total_contributors'] ?? 0) + ($projects['total_projects'] ?? 0) + ($fundDay['total_contributors'] ?? 0),
        ];
    }

    private function getMonthlyData($query, $type)
    {
        return $query->select([
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as record_count'),
            DB::raw('SUM(' . $this->getAmountField($type) . ') as total_amount'),
        ])
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) use ($type) {
                return [
                    'period' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
                    'record_count' => $item->record_count,
                    'total_amount' => (float) $item->total_amount,
                    'type' => $type,
                ];
            })->toArray();
    }

    private function getAmountField($type)
    {
        return match ($type) {
            'projects' => 'profit',
            'fund_day' => 'total_contributed',
            default => 'total_contributed'
        };
    }

    private function generateReportData($reportType, $startDate, $endDate, $dataSource, $user)
    {
        switch ($reportType) {
            case 'summary':
                return $this->generateSummaryReport($user, $startDate, $endDate, $dataSource);
            case 'mitupo':
                return $this->generateMitupoReport($user, $startDate, $endDate);
            case 'contributor_type':
                return $this->generateContributorTypeReport($user, $startDate, $endDate);
            case 'monthly':
                return $this->generateMonthlyReport($user, $startDate, $endDate, $dataSource);
            case 'detailed':
                return $this->generateDetailedReport($user, $startDate, $endDate, $dataSource);
            case 'projects':
                return $this->generateProjectsReport($user, $startDate, $endDate);
            case 'fund_day':
                return $this->generateFundDayReport($user, $startDate, $endDate);
            case 'combined':
                return $this->generateCombinedReport($user, $startDate, $endDate);
            default:
                return [];
        }
    }

    private function exportToCsv($data, $filename, $reportType, $dataSource)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($data, $reportType, $dataSource) {
            $file = fopen('php://output', 'w');
            fwrite($file, "\xEF\xBB\xBF");

            if (empty($data)) {
                fputcsv($file, ['No data available for the selected criteria']);
                fclose($file);
                return;
            }

            // Handle different report types
            if ($reportType === 'summary') {
                $this->exportSummaryToCsv($file, $data, $dataSource);
            } elseif ($reportType === 'combined') {
                $this->exportCombinedToCsv($file, $data);
            } else {
                $this->exportTabularToCsv($file, $data, $reportType);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportSummaryToCsv($file, $data, $dataSource)
    {
        if ($dataSource === 'all') {
            // Export combined summary
            $rows = [
                ['Section', 'Metric', 'Value'],
            ];

            if (isset($data['contributions'])) {
                $contributions = $data['contributions'];
                $rows[] = ['Contributions', 'Total Contributors', $contributions['total_contributors'] ?? 0];
                $rows[] = ['Contributions', 'Total Amount', '$' . number_format($contributions['total_amount'] ?? 0, 2)];
                $rows[] = ['Contributions', 'Total T-Shirts', $contributions['total_tshirts'] ?? 0];
                $rows[] = ['Contributions', 'Total Cement Bags', $contributions['total_cement_bags'] ?? 0];
                $rows[] = ['Contributions', 'Average Contribution', '$' . number_format($contributions['average_contribution'] ?? 0, 2)];
            }

            if (isset($data['projects'])) {
                $projects = $data['projects'];
                $rows[] = ['Projects', 'Total Projects', $projects['total_projects'] ?? 0];
                $rows[] = ['Projects', 'Total Revenue', '$' . number_format($projects['total_revenue'] ?? 0, 2)];
                $rows[] = ['Projects', 'Total Profit', '$' . number_format($projects['total_profit'] ?? 0, 2)];
                $rows[] = ['Projects', 'Average Profit', '$' . number_format($projects['average_profit'] ?? 0, 2)];
            }

            if (isset($data['fund_day'])) {
                $fundDay = $data['fund_day'];
                $rows[] = ['Fund Day', 'Total Contributors', $fundDay['total_contributors'] ?? 0];
                $rows[] = ['Fund Day', 'Total Amount', '$' . number_format($fundDay['total_amount'] ?? 0, 2)];
                $rows[] = ['Fund Day', 'Total Cement Bags', $fundDay['total_cement_bags'] ?? 0];
            }

            if (isset($data['combined'])) {
                $combined = $data['combined'];
                $rows[] = ['Combined', 'Grand Total', '$' . number_format($combined['grand_total'] ?? 0, 2)];
                $rows[] = ['Combined', 'Total Records', $combined['total_records'] ?? 0];
            }

            foreach ($rows as $row) {
                fputcsv($file, $row);
            }
        } else {
            // Export single data source summary
            $sectionData = $data[$dataSource] ?? $data;
            $sectionName = ucfirst(str_replace('_', ' ', $dataSource));

            $rows = [
                ['Metric', 'Value'],
            ];

            foreach ($sectionData as $key => $value) {
                $label = ucfirst(str_replace('_', ' ', $key));
                if (is_numeric($value) && strpos($key, 'amount') !== false || strpos($key, 'revenue') !== false || strpos($key, 'profit') !== false || strpos($key, 'cost') !== false) {
                    $displayValue = '$' . number_format($value, 2);
                } else {
                    $displayValue = $value;
                }
                $rows[] = [$label, $displayValue];
            }

            foreach ($rows as $row) {
                fputcsv($file, $row);
            }
        }
    }

    private function exportCombinedToCsv($file, $data)
    {
        $rows = [
            ['Metric', 'Value'],
            ['Total Contributions Amount', '$' . number_format($data['contributions_total'] ?? 0, 2)],
            ['Total Projects Profit', '$' . number_format($data['projects_profit'] ?? 0, 2)],
            ['Total Fund Day Amount', '$' . number_format($data['fund_day_total'] ?? 0, 2)],
            ['Grand Total', '$' . number_format($data['grand_total'] ?? 0, 2)],
            ['Contributions Count', $data['contributions_count'] ?? 0],
            ['Projects Count', $data['projects_count'] ?? 0],
            ['Fund Day Count', $data['fund_day_count'] ?? 0],
            ['Total Records', $data['total_records'] ?? 0],
        ];

        foreach ($rows as $row) {
            fputcsv($file, $row);
        }
    }

    private function exportTabularToCsv($file, $data, $reportType)
    {
        if (!empty($data)) {
            // Handle nested data structures
            if (isset($data['contributions']) || isset($data['projects']) || isset($data['fund_day'])) {
                // Multi-section data
                foreach ($data as $section => $sectionData) {
                    if (!empty($sectionData)) {
                        fputcsv($file, [ucfirst($section) . ' Report']);
                        $headers = array_keys($sectionData[0]);
                        fputcsv($file, $headers);

                        foreach ($sectionData as $row) {
                            fputcsv($file, $row);
                        }
                        fputcsv($file, []); // Empty row between sections
                    }
                }
            } else {
                // Single section data
                $headers = array_keys($data[0]);
                fputcsv($file, $headers);

                foreach ($data as $row) {
                    fputcsv($file, $row);
                }
            }
        }
    }

    private function exportToPdf($data, $filename)
    {
        return response()->json([
            'message' => 'PDF export not implemented. Please use CSV export.',
            'data' => $data
        ], 501);
    }

    private function generateFilename($reportType, $format, $dataSource)
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $typeMap = [
            'summary' => 'summary',
            'mitupo' => 'by_mitupo',
            'contributor_type' => 'by_contributor_type',
            'monthly' => 'monthly',
            'detailed' => 'detailed',
            'projects' => 'projects',
            'fund_day' => 'fund_day',
            'combined' => 'combined',
        ];

        $source = $dataSource === 'all' ? 'all_sources' : $dataSource;

        return "reports_{$typeMap[$reportType]}_{$source}_{$timestamp}.{$format}";
    }
}
