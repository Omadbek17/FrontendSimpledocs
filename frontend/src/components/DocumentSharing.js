import React, { useState } from "react";
import api from "../utils/api";

function DocumentSharing({ docId, onShared }) {
  const [shareWith, setShareWith] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!shareWith.trim()) return;

    setLoading(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("access");

    try {
      const data = await api.post(
        `/documents/${docId}/share/`,
        { username: shareWith },
        token
      );

      setMessage(data.message || "Document shared successfully!");
      setShareWith("");

      if (typeof onShared === "function") {
        onShared();
      }
    } catch (err) {
      console.error("Share error:", err);
      setError(
        err.message ||
          "Network error while sharing document."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Share Document
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter username"
          value={shareWith}
          onChange={(e) => setShareWith(e.target.value)}
          className="flex-grow border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <button
          disabled={!shareWith.trim() || loading}
          onClick={handleShare}
          className={`px-4 py-2 text-sm rounded font-semibold text-white ${
            shareWith.trim() && !loading
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </div>
      {message && (
        <p className="text-green-600 dark:text-green-400 text-sm mt-2">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

export default DocumentSharing;
