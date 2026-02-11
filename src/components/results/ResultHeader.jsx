import React from "react";

function ResultsHeader({ poll, onClose }) {
  const getStatusColor = () => {
    switch (poll.status) {
      case "active": return "bg-green-100 text-green-800 border-green-300";
      case "closed": return "bg-red-100 text-red-800 border-red-300";
      case "expired": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = () => {
    switch (poll.status) {
      case "active": return "🟢";
      case "closed": return "🔴";
      case "expired": return "🟡";
      default: return "⚪";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{getStatusIcon()}</span>
            <span className={`px-4 py-1.5 rounded-full border font-semibold text-sm ${getStatusColor()}`}>
              {poll.status.toUpperCase()}
            </span>

            {poll.isCreator && poll.status === "active" && (
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-1 rounded-full"
              >
                Close Poll
              </button>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">{poll.question}</h1>
          <p className="text-gray-600">{poll.totalVotes} votes</p>
        </div>
      </div>
    </div>
  );
}

export default ResultsHeader;
