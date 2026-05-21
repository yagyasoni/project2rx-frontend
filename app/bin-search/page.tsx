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
        `${API_BASE}/api/bin-search?${params.toString()}`,
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
      </div>
    </ProtectedRoute>
  );
}
