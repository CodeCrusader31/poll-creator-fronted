import React from "react";

function OptionsList({ options, setOptions }) {
  const handleChange = (i, value) => {
    const updated = [...options];
    updated[i] = value;
    setOptions(updated);
  };

  const addOption = () => options.length < 10 && setOptions([...options, ""]);
  const removeOption = (i) =>
    options.length > 2 && setOptions(options.filter((_, idx) => idx !== i));

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        <label className="text-sm font-semibold">Options *</label>
        <button type="button" onClick={addOption} className="text-blue-600 text-sm">
          + Add Option
        </button>
      </div>

      <div className="space-y-3">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={opt}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(i)} className="text-red-500">✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OptionsList;
