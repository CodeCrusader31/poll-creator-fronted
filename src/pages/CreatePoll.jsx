

import React, { useState } from "react";
import { createPoll } from "../api/pollApi";
import { useNavigate } from "react-router-dom";

import CreatePollHeader from "../components/createPoll/CreatePollHeader";
import QuestionInput from "../components/createPoll/QuestionInput";
import OptionsList from "../components/createPoll/OptionsList";
import ErrorAlert from "../components/createPoll/ErrorAlert";
import PollSettings from "../components/createPoll/PollSettings";
import SubmitSection from "../components/createPoll/SubmitSection";
import TipsCard from "../components/createPoll/TipsCard";

function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [votingMode, setVotingMode] = useState("anonymous");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      const res = await createPoll({
        question,
        options,
        allowMultiple,
        votingMode,
        expiresAt
      });

      navigate(`/poll/${res.data.pollId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create poll. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <CreatePollHeader />

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <QuestionInput question={question} setQuestion={setQuestion} />
            <OptionsList options={options} setOptions={setOptions} />
            <ErrorAlert error={error} />
            <PollSettings
              allowMultiple={allowMultiple}
              setAllowMultiple={setAllowMultiple}
              votingMode={votingMode}
              setVotingMode={setVotingMode}
              expiresAt={expiresAt}
              setExpiresAt={setExpiresAt}
            />
            <SubmitSection isSubmitting={isSubmitting} />
          </form>
        </div>

        <TipsCard />
      </div>
    </div>
  );
}

export default CreatePoll;
