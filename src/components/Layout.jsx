import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import React, { useState } from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Header
        open={sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex h-screen bg-white pt-16">
        <Sidebar open={sidebarOpen} />
        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{
            marginLeft: sidebarOpen ? 224 : 64,
            transition: "margin-left 0.3s",
          }}
        >
          <main className="flex-1 px-8 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
