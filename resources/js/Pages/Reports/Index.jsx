import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

// Report Components - Define these OUTSIDE the main component function
const SummaryReport = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-800 dark:text-blue-300">
        Total Contributors
      </h4>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        {data.total_contributors}
      </p>
    </div>
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
      <h4 className="font-semibold text-green-800 dark:text-green-300">
        Total Amount Raised
      </h4>
      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
        ${data.total_amount?.toFixed(2)}
      </p>
    </div>
    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
      <h4 className="font-semibold text-purple-800 dark:text-purple-300">
        Average Contribution
      </h4>
      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
        ${data.average_contribution?.toFixed(2)}
      </p>
    </div>
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">
        Total T-Shirts
      </h4>
      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
        {data.total_tshirts}
      </p>
    </div>
    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
      <h4 className="font-semibold text-orange-800 dark:text-orange-300">
        Total Cement Bags
      </h4>
      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
        {data.total_cement_bags}
      </p>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
      <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">
        T-Shirt Revenue
      </h4>
      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        ${data.tshirt_revenue?.toFixed(2)}
      </p>
    </div>
  </div>
);

const MitupoReport = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Mutupo
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Contributors
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Total Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            T-Shirts
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Cement Bags
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Average
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.mutupo_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.contributor_count}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
              ${item.total_amount?.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.total_tshirts}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.total_cement_bags}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              ${item.average_contribution?.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ContributorTypeReport = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Contributor Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Contributors
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Total Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Average
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.contributor_type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.contributor_count}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
              ${item.total_amount?.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              ${item.average_contribution?.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MonthlyReport = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Period
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Contributors
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Total Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            T-Shirts
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Cement Bags
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.period}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.contributor_count}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
              ${item.total_amount?.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.total_tshirts}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.total_cement_bags}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DetailedReport = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Contributor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Mutupo
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            T-Shirts
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Cement Bags
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Total
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.contributor_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.mutupo}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.contributor_type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.no_of_tshirts} (${item.tshirt_amount})
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.no_of_cement_bags} (${item.cement_amount})
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
              ${item.total_contributed?.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Main component function
export default function Index({ auth, reportData: initialReportData }) {
  const [reportData, setReportData] = useState(initialReportData || null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { data, setData, errors, processing } = useForm({
    report_type: "summary",
    start_date: "",
    end_date: "",
  });

  const reportTypes = [
    {
      value: "summary",
      label: "Summary Report",
      description: "Overview of total contributions and key metrics",
    },
    {
      value: "mitupo",
      label: "By Mutupo",
      description: "Contributions grouped by mutupo/totem",
    },
    {
      value: "contributor_type",
      label: "By Contributor Type",
      description: "Contributions by guest type",
    },
    {
      value: "monthly",
      label: "Monthly Breakdown",
      description: "Contributions by month",
    },
    {
      value: "detailed",
      label: "Detailed Report",
      description: "Complete list of all contributions",
    },
  ];

  const generateReport = (e) => {
    e.preventDefault();
    setLoading(true);

    router.post(route("reports.generate"), data, {
      preserveScroll: true,
      onSuccess: (page) => {
        if (page.props.reportData) {
          setReportData(page.props.reportData);
        }
        setLoading(false);
      },
      onError: (errors) => {
        console.error("Validation errors:", errors);
        setLoading(false);
      },
    });
  };

  const exportReport = (format) => {
    setExporting(true);

    router.post(
      route("reports.export"),
      {
        report_type: data.report_type,
        start_date: data.start_date,
        end_date: data.end_date,
        format: format,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setExporting(false);
        },
        onError: (errors) => {
          console.error("Export errors:", errors);
          setExporting(false);
        },
        onFinish: () => setExporting(false),
      }
    );
  };

  const renderReport = () => {
    if (!reportData || !reportData.data) return null;

    switch (reportData.report_type) {
      case "summary":
        return <SummaryReport data={reportData.data} />;
      case "mitupo":
        return <MitupoReport data={reportData.data} />;
      case "contributor_type":
        return <ContributorTypeReport data={reportData.data} />;
      case "monthly":
        return <MonthlyReport data={reportData.data} />;
      case "detailed":
        return <DetailedReport data={reportData.data} />;
      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No report data available for this report type.
          </div>
        );
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Reports
          </h2>
        </div>
      }
    >
      <Head title="Reports" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Report Generator Form */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Generate Report
              </h3>

              <form onSubmit={generateReport}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Report Type */}
                  <div>
                    <InputLabel htmlFor="report_type" value="Report Type *" />
                    <select
                      id="report_type"
                      value={data.report_type}
                      onChange={(e) => setData("report_type", e.target.value)}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    >
                      {reportTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <InputError message={errors.report_type} className="mt-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {
                        reportTypes.find((t) => t.value === data.report_type)
                          ?.description
                      }
                    </p>
                  </div>

                  {/* Start Date */}
                  <div>
                    <InputLabel htmlFor="start_date" value="Start Date" />
                    <TextInput
                      id="start_date"
                      type="date"
                      value={data.start_date}
                      onChange={(e) => setData("start_date", e.target.value)}
                      className="mt-1 block w-full"
                    />
                    <InputError message={errors.start_date} className="mt-2" />
                  </div>

                  {/* End Date */}
                  <div>
                    <InputLabel htmlFor="end_date" value="End Date" />
                    <TextInput
                      id="end_date"
                      type="date"
                      value={data.end_date}
                      onChange={(e) => setData("end_date", e.target.value)}
                      className="mt-1 block w-full"
                    />
                    <InputError message={errors.end_date} className="mt-2" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="submit"
                    disabled={loading || processing}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2 rounded shadow transition-all"
                  >
                    {loading ? "Generating..." : "Generate Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Report Results */}
          {reportData && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {
                        reportTypes.find(
                          (t) => t.value === reportData.report_type
                        )?.label
                      }
                    </h3>
                    {reportData.start_date || reportData.end_date ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Period: {reportData.start_date || "Start"} to{" "}
                        {reportData.end_date || "End"}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => exportReport("csv")}
                      disabled={exporting}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white px-4 py-2 rounded text-sm transition-all"
                    >
                      {exporting ? "Exporting..." : "Export CSV"}
                    </button>
                  </div>
                </div>

                {renderReport()}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
