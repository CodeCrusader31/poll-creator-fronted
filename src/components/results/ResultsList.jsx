import React from "react";
import ResultOption from "./ResultOption";

function ResultsList({ options }) {
  const maxPercent = Math.max(...options.map(o => o.percentage || 0));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Results</h2>
      <div className="space-y-6">
        {options.map((opt, i) => (
          <ResultOption key={opt.id} option={opt} index={i} maxPercent={maxPercent} />
        ))}
      </div>
    </div>
  );
}

export default ResultsList;
