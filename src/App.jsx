// src/App.jsx
import { Routes, Route } from "react-router-dom";
import React from "react";
import CreatePoll from "./pages/CreatePoll";
import VotePoll from "./pages/VotePoll";
import Results from "./pages/Result";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePoll />} />
      <Route path="/poll/:id" element={<VotePoll />} />
      <Route path="/results/:id" element={<Results />} />
    </Routes>
  );
}

export default App;
