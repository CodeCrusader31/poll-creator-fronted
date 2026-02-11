import React from "react";

function QuickActions({ pollId }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
      <h4 className="text-sm font-semibold text-gray-600 mb-3">Quick Actions</h4>

      <div className="flex flex-wrap gap-3">
        <a
          href={`/poll/${pollId}`}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
        >
          📊 Vote Again
        </a>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
        >
          🔄 Refresh Results
        </button>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
        >
          🖨️ Print Results
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
