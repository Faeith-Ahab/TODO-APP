import { Form, Link, useLocation } from "@remix-run/react";
import {
  PenSquare,
  Clock,
  CheckCircle,
  Trash2,
  Search,
  Power,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const navItems = [
  { to: "/todos/new", label: "New Task", icon: PenSquare, filter: "new" },
  { to: "/todos/pending", label: "Pending", icon: Clock, filter: "pending" },
  { to: "/todos/completed", label: "Completed", icon: CheckCircle, filter: "completed" },
  { to: "/todos/deleted", label: "Deleted", icon: Trash2, filter: "deleted" },
];

export function Sidebar({ searchQuery, onSearchChange }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full py-6 px-4 gap-4 w-[280px] flex-shrink-0">
      {/* Logo */}
      <div className="mb-2">
        <div className="logo-font text-3xl leading-none">TODO</div>
        <div className="logo-font text-3xl leading-none">APP</div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-item ${location.pathname === to ? "active" : ""}`}
          >
            <Icon size={22} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}

        {/* Search */}
        <div className="mt-2">
          <div className="search-box">
            <Search size={18} className="text-white/60 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sign out */}
      <Form method="post" action="/logout">
        <button type="submit" className="signout-btn">
          <span>Sign out</span>
          <Power size={20} strokeWidth={1.8} />
        </button>
      </Form>
    </div>
  );
}
