import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // 👈 your central API handler

const CreateDocument = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      setError("You must be logged in to create a document.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/documents/", { title }, token);

      // navigate to editor on success
      sessionStorage.setItem("fromCreate", "true");
      navigate(`/editor/${response.id}`);
    } catch (err) {
      console.error("CreateDocument error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Create New Document
      </h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter document title"
        className="w-full px-4 py-2 mb-4 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />

      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          loading
            ? "bg-gray-400 dark:bg-gray-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Creating..." : "Create Document"}
      </button>
    </div>
  );
};

export default CreateDocument;
