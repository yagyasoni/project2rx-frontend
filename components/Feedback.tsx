"use client";

import { useState } from "react";
import axios from "axios";

const API_BASE = "https://api.auditprorx.com";

export default function Feedback() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    subject: "",
    message: "",
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const handleFeedbackChange = (e: any) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.subject || !feedback.message) return;

    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post(`${API_BASE}/admin/feedbacks`, {
        user_id: userId || null,
        subject: feedback.subject,
        message: feedback.message,
      });
      console.log(res?.data);

      setFeedbackSuccess("Feedback sent successfully!");
      setFeedback({ subject: "", message: "" });
      setTimeout(() => {
        setFeedbackSuccess("");
      }, 1500);
    } catch (error: any) {
      console.error("Feedback error:", error);

      const msg =
        error?.response?.data?.message ||
        "Failed to send feedback. Please try again.";

      setFeedbackSuccess(msg);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showFeedback && (
          <button
            onClick={() => setShowFeedback(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition text-sm font-medium"
          >
            Feedback
          </button>
        )}
      </div>
      {/* Floating Feedback Card */}
      {showFeedback && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() => setShowFeedback(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all"
          />

          {/* FEEDBACK CARD */}
          <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Send Feedback
              </h3>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedbackSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              <input
                type="text"
                name="subject"
                value={feedback.subject}
                onChange={handleFeedbackChange}
                maxLength={25}
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />

              <textarea
                name="message"
                value={feedback.message}
                onChange={handleFeedbackChange}
                rows={3}
                maxLength={500}
                placeholder="Your message..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500"
              />

              {feedbackSuccess && (
                <p className="text-green-600 text-xs">{feedbackSuccess}</p>
              )}

              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedback.subject || !feedback.message}
                className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 disabled:opacity-40"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}{" "}
    </>
  );
}
