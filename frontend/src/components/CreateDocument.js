import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  
    setError("");
    setLoading(true);
  
    // 🔍 Debug: Check if token exists before making the request
    console.log("Access token before creating doc:", localStorage.getItem("access"));
  
    try {
      const response = await fetch("http://localhost:8000/api/documents/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ title }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create document");
      }
  
      const data = await response.json();
      sessionStorage.setItem("fromCreate", "true");
      navigate(`/editor/${data.id}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
