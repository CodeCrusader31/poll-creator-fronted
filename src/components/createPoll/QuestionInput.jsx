import React from "react";

function QuestionInput({ question, setQuestion }) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Poll Question <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none min-h-[120px]"
          maxLength={200}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {question.length}/200
        </div>
      </div>
    </div>
  );
}

export default QuestionInput;
