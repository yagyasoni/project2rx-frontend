"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

const API_BASE = "https://api.auditprorx.com";

type BinEntry = {
  pbm_name: string;
  payer_type: string;
};

export default function BinSearch() {
  const [binNumber, setBinNumber] = useState("");
  const [pcnNumber, setPcnNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [results, setResults] = useState<BinEntry[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    subject: "",
    message: "",
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const handleBinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setBinNumber(value);
    setSearched(false);
    setResults([]);
  };

  const handleSearch = async () => {
    if (binNumber.length < 1) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ bin: binNumber });
      if (pcnNumber.trim()) params.append("pcn", pcnNumber.trim());
      if (groupNumber.trim()) params.append("group", groupNumber.trim());

      const res = await axios.get(
        `${API_BASE}/api/bin-search?${params.toString()}`
      );
      setResults(res.data || []);
    } catch (err) {
      console.error("BIN search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && binNumber.length >= 1) handleSearch();
  };

  const isReady = binNumber.length >= 4;
  const canSearch = binNumber.length >= 1 && !loading;

  const handleFeedbackChange = (e: any) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.subject || !feedback.message) return;

    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post(
        `${API_BASE}/admin/feedbacks`,
        {
          user_id: userId || null,
          subject: feedback.subject,
          message: feedback.message,
        },
      );
      console.log(res?.data);

      setFeedbackSuccess("Feedback sent successfully!");
      setFeedback({ subject: "", message: "" });
    } catch (error: any) {
      console.error("Feedback error:", error);

      const msg =
        error?.response?.data?.message ||
        "Failed to send feedback. Please try again.";

      setFeedbackSuccess(msg);
    }
  };

  return (
    <ProtectedRoute role="user">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full">
            <div className="mt-12">
              <div className="flex items-center justify-center min-h-[50vh]">
                <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
                  <CardContent className="p-12">
                    <div className="text-center mb-8">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Search Insurance BIN
                      </h1>
                      <p className="text-lg text-gray-500">
                        Enter a BIN number to identify the PBM and payer type.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* BIN Field */}
                      <div>
                        <label
                          htmlFor="bin-number"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          BIN Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            id="bin-number"
                            type="text"
                            value={binNumber}
                            onChange={handleBinChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter BIN number"
                            className={`pr-12 h-12 text-base transition-colors ${
                              isReady
                                ? "border-green-400 focus:border-green-500 focus:ring-green-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                            maxLength={6}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isReady ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Search className="h-5 w-5 text-gray-400" />
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {binNumber.length}/6 digits
                        </p>
                      </div>

                      {/* PCN Field */}
                      <div>
                        <label
                          htmlFor="pcn-number"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          PCN Number{" "}
                          <span className="text-gray-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <Input
                          id="pcn-number"
                          type="text"
                          value={pcnNumber}
                          onChange={(e) => {
                            setPcnNumber(e.target.value);
                            setSearched(false);
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder="Enter PCN number"
                          className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      {/* Group Field */}
                      <div>
                        <label
                          htmlFor="group-number"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Group Number{" "}
                          <span className="text-gray-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <Input
                          id="group-number"
                          type="text"
                          value={groupNumber}
                          onChange={(e) => {
                            setGroupNumber(e.target.value);
                            setSearched(false);
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder="Enter Group number"
                          className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      {/* Search Button */}
                      <button
                        onClick={handleSearch}
                        disabled={!canSearch}
                        className="w-full h-12 bg-gray-900 text-white rounded-lg font-semibold text-base hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Search className="h-5 w-5" />
                        )}
                        {loading ? "Searching..." : "Search"}
                      </button>
                    </div>

                    {/* Results */}
                    {searched && (
                      <div className="mt-8 space-y-3">
                        {results.length > 0 ? (
                          <>
                            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span>
                                {results.length} result
                                {results.length > 1 ? "s" : ""} found
                              </span>
                            </div>
                            {results.map((r, i) => (
                              <div
                                key={i}
                                className="bg-gray-900 text-white rounded-xl py-4 px-6 font-bold tracking-wide text-lg"
                              >
                                {binNumber} — {r.pbm_name} ({r.payer_type})
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="bg-red-50 border border-red-200 rounded-xl py-6 px-6 text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
                              <XCircle className="h-5 w-5" />
                              <span>No results found for this BIN number.</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                              For more queries, please contact us.
                            </p>
                            <a
                              href="mailto:Rx.drugdrop@gmail.com"
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              Contact Support
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
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
                  onClick={() => setShowFeedback(false)}
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
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />

                <textarea
                  name="message"
                  value={feedback.message}
                  onChange={handleFeedbackChange}
                  rows={3}
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
        )}
      </div>
    </ProtectedRoute>
  );
}