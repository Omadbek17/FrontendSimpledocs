import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import DocumentList from "./components/DocumentList";
import DocumentEditor from "./components/DocumentEditor";
import CreateDocument from "./components/CreateDocument";
import Navbar from "./components/Navbar";
import { DarkModeProvider } from "./context/DarkModeContext";
import MainPage from "./MainPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    setIsLoggedIn(false);
    window.location.href = "/"; // ✅ Full reload + redirect to login
  };

  return (
    <DarkModeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 text-gray-800 font-sans transition-all dark:bg-gray-900 dark:text-white">
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <main className="max-w-4xl mx-auto px-6 py-12">
            <Routes>
              {!isLoggedIn ? (
                <>
                  <Route path="/" element={<AuthMenu onLogin={handleLogin} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/documents" element={<DocumentListWrapper />} />
                  <Route path="/editor/:id" element={<DocumentEditorWrapper />} />
                  <Route path="/create" element={<CreateDocumentWrapper />} />
                  <Route path="*" element={<Navigate to="/documents" />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

// ✅ Handles login/register toggle
function AuthMenu({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md mx-auto">
      {showRegister ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
          <Register onRegisterSuccess={handleRegisterSuccess} />
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <button
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
          <Login onLogin={onLogin} />
          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <button
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </p>
        </>
      )}
    </div>
  );
}

// ✅ Wrapper to connect DocumentList to router
function DocumentListWrapper() {
  const navigate = useNavigate();

  const handleSelectDocument = (id) => {
    navigate(`/editor/${id}`);
  };

  return <DocumentList onSelectDocument={handleSelectDocument} />;
}

// ✅ Wrapper to load a single document
function DocumentEditorWrapper() {
  const { id } = useParams();
  const location = useLocation();
  const fromCreate = location.state?.fromCreate === true;

  return (
    <DocumentEditor
      docId={id}
      fromCreate={fromCreate}
      onBack={() => {
        window.history.back();
      }}
    />
  );
}

// ✅ Wrapper to create and open a new document
function CreateDocumentWrapper() {
  const navigate = useNavigate();

  const handleCreated = (newDocId) => {
    navigate(`/editor/${newDocId}`, { state: { fromCreate: true } });
  };

  return <CreateDocument onCreated={handleCreated} />;
}

export default App;
