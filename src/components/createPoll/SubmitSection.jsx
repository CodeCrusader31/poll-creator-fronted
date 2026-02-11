import React from "react";

function SubmitSection({ isSubmitting }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg"
    >
      {isSubmitting ? "Creating Poll..." : "Create & Share Poll"}
    </button>
  );
}

export default SubmitSection;
