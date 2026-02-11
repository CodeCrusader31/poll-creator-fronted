


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPoll, closePoll } from "../api/pollApi";
import io from "socket.io-client";

import ResultsHeader from "../components/results/ResultHeader";
import ResultsList from "../components/results/ResultsList";
import ShareSection from "../components/results/ShareSection";
import QuickActions from "../components/results/QuickActions";
//const socket = io("http://localhost:5000");
const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""));

function Results() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const res = await getPoll(id);
      setPoll(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load poll results.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePoll = async () => {
    try {
      await closePoll(id);
      setPoll((prev) => ({ ...prev, status: "closed" }));
    } catch {
      setError("Failed to close poll.");
    }
  };

  useEffect(() => {
    fetchPoll();

    socket.emit("join-poll", id);

    socket.on("vote-updated", (updatedPoll) => setPoll(updatedPoll));
    socket.on("poll-closed", () =>
      setPoll((prev) => ({ ...prev, status: "closed" }))
    );
    socket.on("poll-expired", () =>
      setPoll((prev) => ({ ...prev, status: "expired" }))
    );

    return () => {
      socket.off("vote-updated");
      socket.off("poll-closed");
      socket.off("poll-expired");
      socket.emit("leave-poll", id);
    };
  }, [id]);

  const shareLink = `${window.location.origin}/poll/${poll?.pollId || id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <p className="text-center p-10">Loading results...</p>;
  if (error && !poll) return <p className="text-center text-red-500 p-10">{error}</p>;
  if (!poll) return <p className="text-center p-10">Poll not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <ResultsHeader poll={poll} onClose={handleClosePoll} />
        <ResultsList options={poll.options} />
        <ShareSection
          link={shareLink}
          copied={copied}
          onCopy={copyLink}
          pollId={poll.pollId}
        />
        <QuickActions pollId={poll.pollId} />

      </div>
    </div>
  );
}

export default Results;
