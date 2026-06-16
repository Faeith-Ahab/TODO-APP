import { Form, Link, useLocation } from "react-router";

import {
  PenSquare,
  Clock,
  CheckCircle,
  Trash2,
  Search,
  Power,
} from "lucide-react";

interface SidebarProps {
  username: string;
  onNavigate?: () => void;
}

const navItems = [
  { to: "/todos/new", label: "New Task", icon: PenSquare, filter: "new" },
  { to: "/todos/pending", label: "Pending", icon: Clock, filter: "pending" },
  { to: "/todos/completed", label: "Completed", icon: CheckCircle, filter: "completed" },
  { to: "/todos/deleted", label: "Deleted", icon: Trash2, filter: "deleted" },
  { to: "/todos/search", label: "Search", icon: Search, filter: "search" },
];

export function Sidebar({ username, onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-font sidebar-logo-line">TODO APP</div>
      </div>

      <div className="sidebar-greeting">{username ? `Hi, ${username}` : "Hi"}</div>

      {/* Nav items */}
      <div className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-item ${location.pathname === to ? "active" : ""}`}
            onClick={onNavigate}
          >
            <Icon className="sidebar-icon" strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <Form method="post" action="/logout" className="sidebar-signout-form">
        <button type="submit" className="signout-btn">
          <span>Sign out</span>
          <Power className="signout-icon" strokeWidth={1.8} />
        </button>
      </Form>
    </aside>
  );
}
