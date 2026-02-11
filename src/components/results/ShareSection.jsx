import React from "react";

function ShareSection({ link, copied, onCopy, pollId }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Share This Poll</h3>
      <div className="flex gap-3">
        <input value={link} readOnly className="flex-1 px-4 py-3 border rounded-lg" />
        <button onClick={onCopy} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default ShareSection;
