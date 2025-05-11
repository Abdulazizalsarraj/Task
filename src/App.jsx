// import React from "react";
// import { Outlet } from "react-router-dom";

// export default function App() {
//   return (
//     <div className="h-screen w-screen overflow-hidden">
//       <Outlet />
//     </div>
//   );
// }

// src/AppLayout.jsx
import React, { useState } from "react";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white pt-16">
      <Header open={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} />

      <div
        className="flex-1 flex flex-col transition-all duration-300 overflow-auto"
        style={{
          marginLeft: sidebarOpen ? 224 : 64,
          transition: "margin-left 0.3s",
        }}
      >
        <main className="flex-1 px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}





