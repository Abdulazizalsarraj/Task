import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  LayoutDashboard,
  Users,
  Folder,
  Calendar,
  FileText,
  LayoutGrid,
  Network,
} from "lucide-react";

const menu = [
  { icon: <HomeIcon size={22} />, label: "Home", to: "/" },
  { icon: <LayoutDashboard size={22} />, label: "Dashboard", to: "/dashboard" },
  { icon: <Users size={22} />, label: "Users", to: "/users" },
  { icon: <Folder size={22} />, label: "Work Drive", to: "/work-drive" },
  { icon: <Network size={22} />, label: "Organization", to: "/organization" },
  { icon: <LayoutGrid size={22} />, label: "My Apps", to: "/my-apps" },
  { icon: <Calendar size={22} />, label: "Attendance", to: "/attendance" },
  { icon: <FileText size={22} />, label: "Leaves", to: "/leaves" },
];

export default function Sidebar({ open }) {
  return (
    <aside
      className={`
        bg-[#e6f3fc] h-screen fixed top-0 left-0 z-20 flex flex-col items-center pt-4 border-r
        transition-all duration-300
        ${open ? "w-56" : "w-16"}
      `}
      style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.04)" }}
    >
      <img
        src="/logo.svg"
        alt="Logo"
        className={`mb-8 transition-all duration-300 ${open ? "w-24" : "w-10"}`}
      />

      <nav className="flex flex-col gap-2 w-full">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `
                flex items-center w-full px-2 py-4 rounded transition-all duration-200
                ${open ? "justify-start" : "justify-center"}
                ${
                  isActive
                    ? "bg-purple-200 text-blue-900"
                    : "text-blue-700 hover:bg-purple-200"
                }
              `
            }
          >
            <span>{item.icon}</span>
            {open && <span className="ml-4 font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
