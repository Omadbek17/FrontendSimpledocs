import React from "react";
import CreateDocument from "./components/CreateDocument";
import DocumentList from "./components/DocumentList";

const MainPage = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <CreateDocument />
      <hr className="border-gray-300 dark:border-gray-700" />
      <DocumentList />
    </div>
  );
};

export default MainPage;
