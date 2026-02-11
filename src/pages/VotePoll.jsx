
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPoll, submitVote } from "../api/pollApi";
import io from "socket.io-client";

const socket = io("http://localhost:5000");


const getVoterId = () => {
  let id = localStorage.getItem("voterId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("voterId", id);
  }
  return id;
};

function VotePoll() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fetchPoll = async () => {
    try {
      setLoading(true);
      const res = await getPoll(id);
      setPoll(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load poll. Please try again.");
      console.error("Error fetching poll:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
    socket.emit("join-poll", id);

    socket.on("vote-updated", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    socket.on("error", (errorMsg) => {
      setError(errorMsg);
    });

    return () => {
      socket.off("vote-updated");
      socket.off("error");
      socket.emit("leave-poll", id);
    };
  }, [id]);

  const toggleOption = (optionId) => {
    if (!poll) return;
    
    if (poll.allowMultiple) {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelected([optionId]);
    }
    setError(null); // Clear error when user selects an option
  };


const handleVote = async () => {
  if (selected.length === 0) {
    setError("Please select an option");
    return;
  }

  if (poll.votingMode === "identified" && !name.trim()) {
    setError("Name required");
    return;
  }

  try {
    setSubmitting(true);
    setError(null);

    const voterId = getVoterId();

    const data = poll.allowMultiple
      ? { optionIds: selected, name: name.trim() || null, voterId }
      : { optionId: selected[0], name: name.trim() || null, voterId };

    await submitVote(id, data);

    navigate(`/results/${id}`);
  } catch (err) {
    if (err.response?.status === 403) {
      setError("You already voted on this poll.");
    } else {
      setError("Failed to submit vote.");
    }
  } finally {
    setSubmitting(false);
  }
};



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Poll...</h2>
          <p className="text-gray-600">Fetching your poll details</p>
        </div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-200 shadow-md w-full"
            onClick={() => navigate("/")}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-gray-400 text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Poll Not Found</h2>
          <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist or has been removed.</p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-200 shadow-md w-full"
            onClick={() => navigate("/")}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const isNameRequired = poll.votingMode === "identified";
  const isNameOptional = poll.votingMode === "both";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📊</span>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {poll.question}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    poll.status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {poll.status === 'open' ? 'Voting Open' : 'Voting Closed'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {poll.allowMultiple ? 'Multiple Choice' : 'Single Choice'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {poll.votingMode === 'anonymous' ? 'Anonymous' : 
                     poll.votingMode === 'identified' ? 'Identified' : 'Optional Name'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {poll.allowMultiple 
                ? "Select one or more options below" 
                : "Select one option below"}
            </p>

            {poll.totalVotes > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">
                    {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''} so far
                  </span>
                  <button 
                    onClick={() => navigate(`/results/${id}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    View Results
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Options Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Your {poll.allowMultiple ? 'Selections' : 'Selection'}:
              <span className="text-sm font-normal text-gray-500 ml-2">
                {selected.length} of {poll.options.length} selected
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {poll.options.map((opt, index) => {
                const isSelected = selected.includes(opt.id || opt._id);
                return (
                  <div
                    key={opt.id || opt._id}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]
                      ${isSelected 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                    onClick={() => toggleOption(opt.id || opt._id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                        ${poll.allowMultiple 
                          ? 'rounded' 
                          : 'rounded-full'
                        }
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                        }
                      `}>
                        {isSelected && (
                          poll.allowMultiple ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{opt.text}</span>
                          {opt.votes > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {opt.votes} votes
                            </span>
                          )}
                        </div>
                        {opt.votes > 0 && poll.totalVotes > 0 && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-400 rounded-full"
                                style={{ width: `${(opt.votes / poll.totalVotes) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-right">
                              {Math.round((opt.votes / poll.totalVotes) * 100)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-blue-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Name Input (if required) */}
          {(isNameRequired || isNameOptional) && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isNameRequired ? (
                  <>
                    Your Name <span className="text-red-500">*</span>
                    <span className="text-sm font-normal text-gray-500 ml-2">(Required to vote)</span>
                  </>
                ) : (
                  <>
                    Your Name <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                  </>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isNameRequired ? "Enter your name to vote" : "Enter your name (optional)"}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  maxLength={50}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
                {name && (
                  <button
                    type="button"
                    onClick={() => setName("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className="text-gray-500">
                  {name.length}/50 characters
                </span>
                {isNameRequired && !name.trim() && (
                  <span className="text-red-500 font-medium">
                    Name is required
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(`/results/${id}`)}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Results
            </button>
            
            <button
              onClick={handleVote}
              disabled={selected.length === 0 || (isNameRequired && !name.trim()) || submitting}
              className={`
                flex-1 px-6 py-3 font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg
                flex items-center justify-center gap-2
                ${selected.length === 0 || (isNameRequired && !name.trim()) || submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                }
              `}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Vote
                  {selected.length > 0 && poll.allowMultiple && (
                    <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-sm">
                      {selected.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Poll Info Footer */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ℹ️ About This Poll
          </h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mt-0.5">🔒</div>
              <div>
                <span className="font-medium text-gray-700">Voting Privacy:</span>{" "}
                {poll.votingMode === 'anonymous' 
                  ? 'Your vote is completely anonymous' 
                  : poll.votingMode === 'identified'
                  ? 'Your name will be recorded with your vote'
                  : 'You can choose to vote anonymously or with your name'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mt-0.5">📝</div>
              <div>
                <span className="font-medium text-gray-700">Voting Type:</span>{" "}
                {poll.allowMultiple 
                  ? 'You can select multiple options' 
                  : 'Select only one option'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mt-0.5">🔄</div>
              <div>
                <span className="font-medium text-gray-700">Live Updates:</span>{" "}
                Results update in real-time as people vote
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotePoll;
