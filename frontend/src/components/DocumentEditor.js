import React, { useEffect, useState, useRef } from "react";
import DocumentSharing from "./DocumentSharing";
import {
  connectWebSocket,
  sendWebSocketMessage,
  closeWebSocket,
} from "../utils/websocket";
import api from "../utils/api";



function DocumentEditor({ docId, onBack }) {
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const fromCreate = useRef(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("fromCreate") === "true") {
      fromCreate.current = true;
      sessionStorage.removeItem("fromCreate");
    }

    if (!docId) return;

    const loadDocument = async () => {
      setLoading(true);
      const token = localStorage.getItem("access");
      try {
        const data = await api.get(`/documents/${docId}/`, token);
        setDocument(data);
        setContent(data.content || "");
        connectWebSocket(docId, handleWebSocketMessage);
      } catch (err) {
        console.error("Error loading document:", err);
        setError("Failed to load document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
    return () => {
      closeWebSocket();
    };
  }, [docId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSavedTime) {
        const secondsAgo = Math.floor((Date.now() - lastSavedTime) / 1000);
        setSaveMsg(`Last saved ${secondsAgo}s ago`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSavedTime]);

  const handleWebSocketMessage = (data) => {
    if (data.content !== content) {
      setContent(data.content);
    }
  };

  const saveContent = async (latestContent) => {
    const token = localStorage.getItem("access");
    try {
      await api.patch(`/documents/${docId}/`, { content: latestContent }, token);
      setLastSavedTime(Date.now());
    } catch (err) {
      console.error("Error saving content:", err);
      setError("Error saving content. Please try again.");
    }
  };

  const handleChange = (e) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      sendWebSocketMessage(updatedContent);
    }, 200);
  };

  if (!docId)
    return (
      <p className="text-center text-gray-500 dark:text-gray-300">
        Select a document to edit.
      </p>
    );
  if (loading)
    return (
      <p className="text-center text-blue-500 dark:text-blue-300">
        Loading document...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 dark:text-red-400">{error}</p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {document.title}
        </h2>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          {fromCreate.current ? "Back to Creation" : "Back to Documents"}
        </button>
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        onBlur={() => saveContent(content)}
        rows={15}
        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-lg p-4 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start writing your document..."
      />

      {saveMsg && (
        <p className="text-green-500 mt-2 text-sm font-medium transition">
          {saveMsg}
        </p>
      )}

      <div className="mt-6">
        <DocumentSharing
          docId={docId}
          saveContent={() => saveContent(content)}
        />
      </div>
    </div>
  );
}

export default DocumentEditor;
