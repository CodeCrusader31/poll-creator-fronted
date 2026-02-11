import React from "react";

function CreatePollHeader() {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
        📊 Create Your Poll
      </h1>
      <p className="text-gray-600 max-w-md mx-auto">
        Create a custom poll in seconds. Share it with friends and get instant results!
      </p>
    </div>
  );
}

export default CreatePollHeader;
