import React from "react";
function PollSettings({ allowMultiple, setAllowMultiple, votingMode, setVotingMode, expiresAt, setExpiresAt }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-4">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={allowMultiple} onChange={e => setAllowMultiple(e.target.checked)} />
        Allow multiple selections
      </label>

      <select value={votingMode} onChange={e => setVotingMode(e.target.value)} className="w-full border rounded p-2">
        <option value="anonymous">Anonymous</option>
        <option value="identified">Identified</option>
        <option value="both">Optional</option>
      </select>

      <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full border rounded p-2" />
    </div>
  );
}

export default PollSettings;
