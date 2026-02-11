import React from "react";

function ResultOption({ option, index, maxPercent }) {
  const percentage = option.percentage || 0;
  const isWinning = percentage === maxPercent && percentage > 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">#{index + 1}</span>
          <span className="font-medium">{option.text}</span>
          {isWinning && <span className="text-xs text-yellow-700">🏆 Leading</span>}
        </div>
        <div className="text-right">
          <div className="font-bold">{percentage}%</div>
          <div className="text-sm text-gray-500">{option.votes} votes</div>
        </div>
      </div>

      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isWinning ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-blue-400"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ResultOption;
