<?php
// app/Http/Controllers/ReportController.php

namespace App\Http\Controllers;

use App\Models\Contribution;
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
            'report_type' => 'required|in:summary,mitupo,contributor_type,monthly,detailed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $user = Auth::user();
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        $query = Contribution::with(['mutupo', 'contributorType']);

        // Apply user-based filtering
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        // Apply date filters if provided
        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $data = [];

        switch ($request->report_type) {
            case 'summary':
                $data = $this->generateSummaryReport($query);
                break;
            case 'mitupo':
                $data = $this->generateMitupoReport($query);
                break;
            case 'contributor_type':
                $data = $this->generateContributorTypeReport($query);
                break;
            case 'monthly':
                $data = $this->generateMonthlyReport($query);
                break;
            case 'detailed':
                $data = $this->generateDetailedReport($query);
                break;
        }

        // Store report data in session and redirect (PRG pattern)
        session()->flash('reportData', [
            'report_type' => $request->report_type,
            'start_date'  => $startDate,
            'end_date'    => $endDate,
            'data'        => $data,
            'filters'     => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ]
        ]);

        return redirect()->route('reports.index');
    }


    public function export(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:summary,mitupo,contributor_type,monthly,detailed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'format' => 'required|in:csv,pdf',
        ]);

        try {
            $user = Auth::user();
            $reportData = $this->generateReportData(
                $request->report_type,
                $request->start_date,
                $request->end_date,
                $user
            );

            $filename = $this->generateFilename($request->report_type, $request->format);

            if ($request->format === 'csv') {
                return $this->exportToCsv($reportData, $filename, $request->report_type);
            }

            return $this->exportToPdf($reportData, $filename);
        } catch (Exception $e) {
            Log::error('Export failed: ' . $e->getMessage());
            return back()->withErrors(['export' => 'Failed to export report: ' . $e->getMessage()]);
        }
    }

    private function generateSummaryReport($query)
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

    private function generateMitupoReport($query)
    {
        return $query->select([
            'mutupo_id',
            DB::raw('COUNT(*) as contributor_count'),
            DB::raw('SUM(total_contributed) as total_amount'),
            DB::raw('SUM(no_of_tshirts) as total_tshirts'),
            DB::raw('SUM(no_of_cement_bags) as total_cement_bags'),
            DB::raw('AVG(total_contributed) as average_contribution'),
        ])
            ->with('mutupo')
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

    private function generateContributorTypeReport($query)
    {
        return $query->select([
            'contributor_type_id',
            DB::raw('COUNT(*) as contributor_count'),
            DB::raw('SUM(total_contributed) as total_amount'),
            DB::raw('AVG(total_contributed) as average_contribution'),
        ])
            ->with('contributorType')
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

    private function generateMonthlyReport($query)
    {
        return $query->select([
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as contributor_count'),
            DB::raw('SUM(total_contributed) as total_amount'),
            DB::raw('SUM(no_of_tshirts) as total_tshirts'),
            DB::raw('SUM(no_of_cement_bags) as total_cement_bags'),
        ])
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'period' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
                    'contributor_count' => $item->contributor_count,
                    'total_amount' => (float) $item->total_amount,
                    'total_tshirts' => $item->total_tshirts,
                    'total_cement_bags' => $item->total_cement_bags,
                ];
            })->toArray();
    }

    private function generateDetailedReport($query)
    {
        return $query->get()->map(function ($contribution) {
            return [
                'contributor_name' => $contribution->contributor_name,
                'mutupo' => $contribution->mutupo->name,
                'contributor_type' => $contribution->contributorType->name,
                'no_of_tshirts' => $contribution->no_of_tshirts,
                'tshirt_amount' => (float) $contribution->tshirt_amount,
                'no_of_cement_bags' => $contribution->no_of_cement_bags,
                'cement_amount' => (float) $contribution->cement_amount,
                'total_contributed' => (float) $contribution->total_contributed,
            ];
        })->toArray();
    }

    private function generateReportData($reportType, $startDate, $endDate, $user)
    {
        $query = Contribution::with(['mutupo', 'contributorType']);

        // Apply user-based filtering
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        switch ($reportType) {
            case 'summary':
                return $this->generateSummaryReport($query);
            case 'mitupo':
                return $this->generateMitupoReport($query);
            case 'contributor_type':
                return $this->generateContributorTypeReport($query);
            case 'monthly':
                return $this->generateMonthlyReport($query);
            case 'detailed':
                return $this->generateDetailedReport($query);
            default:
                return [];
        }
    }

    private function exportToCsv($data, $filename, $reportType)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($data, $reportType) {
            $file = fopen('php://output', 'w');
            fwrite($file, "\xEF\xBB\xBF");

            if (empty($data)) {
                fputcsv($file, ['No data available for the selected criteria']);
                fclose($file);
                return;
            }

            // Handle different report types
            if ($reportType === 'summary') {
                // For summary reports, create a key-value format
                $rows = [
                    ['Metric', 'Value'],
                    ['Total Contributors', $data['total_contributors'] ?? 0],
                    ['Total Amount Raised', '$' . number_format($data['total_amount'] ?? 0, 2)],
                    ['Total T-Shirts', $data['total_tshirts'] ?? 0],
                    ['Total Cement Bags', $data['total_cement_bags'] ?? 0],
                    ['Average Contribution', '$' . number_format($data['average_contribution'] ?? 0, 2)],
                    ['T-Shirt Revenue', '$' . number_format($data['tshirt_revenue'] ?? 0, 2)],
                    ['Cement Revenue', '$' . number_format($data['cement_revenue'] ?? 0, 2)],
                ];

                foreach ($rows as $row) {
                    fputcsv($file, $row);
                }
            } else {
                // For tabular reports
                if (!empty($data)) {
                    // Get headers from first item
                    $headers = array_keys($data[0]);
                    fputcsv($file, $headers);

                    // Add data rows
                    foreach ($data as $row) {
                        fputcsv($file, $row);
                    }
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportToPdf($data, $filename)
    {

        return response()->json([
            'message' => 'PDF export not implemented. Please use CSV export.',
            'data' => $data
        ], 501);
    }

    private function generateFilename($reportType, $format)
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $typeMap = [
            'summary' => 'summary',
            'mitupo' => 'by_mitupo',
            'contributor_type' => 'by_contributor_type',
            'monthly' => 'monthly',
            'detailed' => 'detailed',
        ];

        return "contributions_report_{$typeMap[$reportType]}_{$timestamp}.{$format}";
    }
}
