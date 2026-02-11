import React from "react";
function TipsCard() {
  return (
    <div className="bg-blue-50 rounded-xl p-6 mt-6">
      <h3 className="font-semibold mb-2">💡 Tips for a Great Poll</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>Keep questions clear</li>
        <li>Provide balanced options</li>
        <li>Use anonymous voting for sensitive topics</li>
      </ul>
    </div>
  );
}

export default TipsCard;
