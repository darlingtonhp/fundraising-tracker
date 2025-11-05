// resources/js/Pages/Reports/Index.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

// Report Components - Define these OUTSIDE the main component function
const SummaryReport = ({ data, dataSource }) => {
  if (dataSource === "all") {
    return (
      <div className="space-y-6">
        {/* Combined Summary */}
        {data.combined && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-4">
              Combined Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Grand Total
                </h5>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  ${data.combined.grand_total?.toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Records
                </h5>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {data.combined.total_records}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contributions Summary */}
        {data.contributions && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
              Contributions Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Contributors
                </h5>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.contributions.total_contributors}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Amount
                </h5>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${data.contributions.total_amount?.toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total T-Shirts
                </h5>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {data.contributions.total_tshirts}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Cement Bags
                </h5>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {data.contributions.total_cement_bags}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Average Contribution
                </h5>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${data.contributions.average_contribution?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Summary */}
        {data.projects && (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
              Projects Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Projects
                </h5>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.projects.total_projects}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Revenue
                </h5>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${data.projects.total_revenue?.toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Profit
                </h5>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${data.projects.total_profit?.toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Average Profit
                </h5>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${data.projects.average_profit?.toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Profit Margin
                </h5>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {data.projects.profit_margin?.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fund Day Summary */}
        {data.fund_day && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">
              Fund Day Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Contributors
                </h5>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {data.fund_day.total_contributors}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Amount
                </h5>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${data.fund_day.total_amount?.toFixed(2)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Cement Bags
                </h5>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {data.fund_day.total_cement_bags}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                  Average Contribution
                </h5>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${data.fund_day.average_contribution?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Single data source summary
  const sectionData = data[dataSource] || data;
  const sectionName =
    dataSource === "contributions"
      ? "Contributions"
      : dataSource === "projects"
      ? "Projects"
      : dataSource === "fund_day"
      ? "Fund Day"
      : "Summary";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(sectionData).map(([key, value]) => (
        <div
          key={key}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
        >
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 capitalize">
            {key.replace(/_/g, " ")}
          </h4>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {typeof value === "number" &&
            (key.includes("amount") ||
              key.includes("revenue") ||
              key.includes("profit") ||
              key.includes("cost"))
              ? `$${value.toFixed(2)}`
              : key.includes("margin")
              ? `${value.toFixed(2)}%`
              : value}
          </p>
        </div>
      ))}
    </div>
  );
};

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

const MonthlyReport = ({ data, dataSource }) => {
  if (dataSource === "all") {
    return (
      <div className="space-y-6">
        {data.contributions && data.contributions.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
              Contributions
            </h4>
            <MonthlyTable data={data.contributions} />
          </div>
        )}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
              Projects
            </h4>
            <MonthlyTable data={data.projects} />
          </div>
        )}
        {data.fund_day && data.fund_day.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">
              Fund Day
            </h4>
            <MonthlyTable data={data.fund_day} />
          </div>
        )}
      </div>
    );
  }

  return <MonthlyTable data={data[dataSource] || data} />;
};

const MonthlyTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Period
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Records
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Total Amount
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
              {item.record_count}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
              ${item.total_amount?.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DetailedReport = ({ data, dataSource }) => {
  if (dataSource === "all") {
    return (
      <div className="space-y-6">
        {data.contributions && data.contributions.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
              Contributions
            </h4>
            <DetailedTable data={data.contributions} />
          </div>
        )}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
              Projects
            </h4>
            <DetailedTable data={data.projects} />
          </div>
        )}
        {data.fund_day && data.fund_day.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">
              Fund Day
            </h4>
            <DetailedTable data={data.fund_day} />
          </div>
        )}
      </div>
    );
  }

  return <DetailedTable data={data[dataSource] || data} />;
};

const DetailedTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  const firstItem = data[0];
  const isMixed = firstItem.type;

  if (isMixed) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {item.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.contributor_name || item.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {item.type === "contribution" && (
                    <div>
                      <div>Mutupo: {item.mutupo}</div>
                      <div>Type: {item.contributor_type}</div>
                      <div>
                        T-Shirts: {item.no_of_tshirts} (${item.tshirt_amount})
                      </div>
                      <div>
                        Cement: {item.no_of_cement_bags} (${item.cement_amount})
                      </div>
                    </div>
                  )}
                  {item.type === "project" && (
                    <div>
                      <div>Cost: ${item.project_cost}</div>
                      <div>Revenue: ${item.revenue}</div>
                      <div>Profit: ${item.profit}</div>
                    </div>
                  )}
                  {item.type === "fund_day" && (
                    <div>
                      <div>Cement Bags: {item.cement_bags}</div>
                      <div>Cement Amount: ${item.cement_amount}</div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
                  $
                  {item.total_contributed ||
                    item.profit ||
                    item.total_contributed ||
                    0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {item.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Single data source detailed view
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {Object.keys(firstItem).map((key) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider capitalize"
              >
                {key.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {typeof value === "number"
                    ? Object.keys(item)[cellIndex].includes("amount") ||
                      Object.keys(item)[cellIndex].includes("revenue") ||
                      Object.keys(item)[cellIndex].includes("profit") ||
                      Object.keys(item)[cellIndex].includes("cost")
                      ? `$${value.toFixed(2)}`
                      : value
                    : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProjectsReport = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Project Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Cost
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Revenue
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Profit
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Margin
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Added By
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
              {item.description || "No description"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
              ${item.project_cost?.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
              ${item.revenue?.toFixed(2)}
            </td>
            <td
              className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                item.profit >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              ${item.profit?.toFixed(2)}
            </td>
            <td
              className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                item.profit_margin >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {item.profit_margin?.toFixed(2)}%
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.added_by}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FundDayReport = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Contributor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Cement Bags
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Cement Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Total Contribution
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Added By
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Date
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
              {item.cement_bags}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              ${item.cement_amount?.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
              ${item.total_contributed?.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.added_by}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {item.created_at}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CombinedReport = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
      <h4 className="font-semibold text-blue-800 dark:text-blue-300">
        Contributions Total
      </h4>
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        ${data.contributions_total?.toFixed(2)}
      </p>
      <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
        {data.contributions_count} records
      </p>
    </div>

    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
      <h4 className="font-semibold text-green-800 dark:text-green-300">
        Projects Profit
      </h4>
      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
        ${data.projects_profit?.toFixed(2)}
      </p>
      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
        {data.projects_count} records
      </p>
    </div>

    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
      <h4 className="font-semibold text-orange-800 dark:text-orange-300">
        Fund Day Total
      </h4>
      <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
        ${data.fund_day_total?.toFixed(2)}
      </p>
      <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
        {data.fund_day_count} records
      </p>
    </div>

    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg md:col-span-2 lg:col-span-3">
      <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">
        Grand Total
      </h4>
      <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
        ${data.grand_total?.toFixed(2)}
      </p>
      <p className="text-lg text-indigo-600 dark:text-indigo-400 mt-2">
        Total of {data.total_records} records across all sources
      </p>
    </div>
  </div>
);

// Main component function
export default function Index({ auth, reportData: initialReportData }) {
  const [reportData, setReportData] = useState(initialReportData || null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { data, setData, errors, processing } = useForm({
    report_type: "summary",
    data_source: "contributions",
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
      dataSources: ["contributions", "all"],
    },
    {
      value: "contributor_type",
      label: "By Contributor Type",
      description: "Contributions by guest type",
      dataSources: ["contributions", "all"],
    },
    {
      value: "monthly",
      label: "Monthly Breakdown",
      description: "Records by month",
    },
    {
      value: "detailed",
      label: "Detailed Report",
      description: "Complete list of all records",
    },
    {
      value: "projects",
      label: "Projects Report",
      description: "Detailed projects analysis",
    },
    {
      value: "fund_day",
      label: "Fund Day Report",
      description: "Fund day contributions details",
    },
    {
      value: "combined",
      label: "Combined Overview",
      description: "Summary across all data sources",
      dataSources: ["all"],
    },
  ];

  const dataSources = [
    { value: "contributions", label: "Contributions Only" },
    { value: "projects", label: "Projects Only" },
    { value: "fund_day", label: "Fund Day Only" },
    { value: "all", label: "All Data Sources" },
  ];

  const currentReportType = reportTypes.find(
    (rt) => rt.value === data.report_type
  );
  const availableDataSources = currentReportType?.dataSources || [
    "contributions",
    "projects",
    "fund_day",
    "all",
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

    // Get the CSRF token from the meta tag
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    // Create a form dynamically
    const form = document.createElement("form");
    form.method = "POST";
    form.action = route("reports.export");

    // Add CSRF token
    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "_token";
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    // Add other form data
    const addField = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    addField("report_type", data.report_type);
    addField("data_source", data.data_source);
    addField("start_date", data.start_date);
    addField("end_date", data.end_date);
    addField("format", format);

    // Submit the form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setTimeout(() => setExporting(false), 2000);
  };

  const renderReport = () => {
    if (!reportData || !reportData.data) return null;

    const { report_type, data_source } = reportData;

    switch (report_type) {
      case "summary":
        return (
          <SummaryReport data={reportData.data} dataSource={data_source} />
        );
      case "mitupo":
        return <MitupoReport data={reportData.data} />;
      case "contributor_type":
        return <ContributorTypeReport data={reportData.data} />;
      case "monthly":
        return (
          <MonthlyReport data={reportData.data} dataSource={data_source} />
        );
      case "detailed":
        return (
          <DetailedReport data={reportData.data} dataSource={data_source} />
        );
      case "projects":
        return <ProjectsReport data={reportData.data} />;
      case "fund_day":
        return <FundDayReport data={reportData.data} />;
      case "combined":
        return <CombinedReport data={reportData.data} />;
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      {currentReportType?.description}
                    </p>
                  </div>

                  {/* Data Source */}
                  <div>
                    <InputLabel htmlFor="data_source" value="Data Source *" />
                    <select
                      id="data_source"
                      value={data.data_source}
                      onChange={(e) => setData("data_source", e.target.value)}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    >
                      {dataSources
                        .filter((ds) => availableDataSources.includes(ds.value))
                        .map((source) => (
                          <option key={source.value} value={source.value}>
                            {source.label}
                          </option>
                        ))}
                    </select>
                    <InputError message={errors.data_source} className="mt-2" />
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Data Source:{" "}
                      {
                        dataSources.find(
                          (ds) => ds.value === reportData.data_source
                        )?.label
                      }
                      {reportData.start_date || reportData.end_date ? (
                        <span className="ml-4">
                          Period: {reportData.start_date || "Start"} to{" "}
                          {reportData.end_date || "End"}
                        </span>
                      ) : null}
                    </p>
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
