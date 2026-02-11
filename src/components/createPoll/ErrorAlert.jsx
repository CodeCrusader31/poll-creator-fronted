import React from "react";

function ErrorAlert({ error }) {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
      {error}
    </div>
  );
}

export default ErrorAlert;
