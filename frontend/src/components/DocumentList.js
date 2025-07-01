import React, { useEffect, useState } from "react";
import DocumentSharing from "./DocumentSharing";
import api from "../utils/api";

const DocumentList = ({ onSelectDocument }) => {
  const [myDocuments, setMyDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [docToDelete, setDocToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("my");

  const fetchDocuments = async () => {
    setLoading(true);
    const token = localStorage.getItem("access");
    try {
      const myData = await api.get("/documents/", token);
      console.log("Fetched my documents:", myData);

      if (Array.isArray(myData)) {
        setMyDocuments(myData);
      } else {
        console.warn("Expected myData to be array, got:", myData);
        setMyDocuments([]);
      }

      const sharedData = await api.get("/documents/shared-documents/", token);
      console.log("Fetched shared documents:", sharedData);

      if (Array.isArray(sharedData)) {
        setSharedDocuments(sharedData);
      } else {
        console.warn("Expected sharedData to be array, got:", sharedData);
        setSharedDocuments([]);
      }

      setError("");
    } catch (err) {
      console.error("Fetch documents error:", err);
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const confirmDelete = (doc) => {
    setDocToDelete(doc);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access");
    try {
      await api.delete(`/documents/${docToDelete.id}/`, token);
      setMyDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
      setSuccessMsg("Document deleted successfully!");
    } catch (err) {
      console.error("Delete document error:", err);
      setError("Failed to delete document.");
    } finally {
      setDocToDelete(null);
      setShowModal(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccessMsg("");
  };

  const handleDocClick = (id) => {
    clearMessages();
    if (typeof onSelectDocument === "function") {
      onSelectDocument(id);
    } else {
      window.location.href = `/editor/${id}`;
    }
  };

  const renderDocumentList = (docs) =>
    Array.isArray(docs) && docs.length > 0 ? (
      <ul className="space-y-4">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded shadow-sm bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer text-blue-700 dark:text-blue-400 font-medium hover:underline"
                onClick={() => handleDocClick(doc.id)}
              >
                📄 {doc.title}
              </div>
              {activeTab === "my" && (
                <button
                  onClick={() => confirmDelete(doc)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-semibold"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="mt-2">
              <DocumentSharing
                docId={doc.id}
                onShared={() => {
                  clearMessages();
                  fetchDocuments();
                  setSuccessMsg("Document shared successfully!");
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600 dark:text-gray-300">No documents found.</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-all">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Documents
        </h2>

        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "my"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            My Documents
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "shared"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Shared with Me
          </button>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 font-semibold mb-4">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="text-green-600 dark:text-green-400 font-semibold mb-4">
            {successMsg}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">
            Loading documents...
          </p>
        ) : activeTab === "my" ? (
          renderDocumentList(myDocuments)
        ) : (
          renderDocumentList(sharedDocuments)
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 shadow-xl text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-600">
                {docToDelete?.title || "Untitled"}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setDocToDelete(null);
                }}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
