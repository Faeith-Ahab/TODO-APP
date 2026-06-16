import { Outlet, useLoaderData } from "react-router";

import { requireUserId } from "~/lib/auth.server";
import { getUserById } from "~/lib/auth.service.server";
import { Sidebar } from "~/components/Sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  return { username: user?.username };
}

export default function TodosLayout() {
  const { username } = useLoaderData<typeof loader>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchQuery = "";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="page-bg" />
      <div className="page-content min-h-screen dashboard-layout">
        <button
          type="button"
          className="drawer-toggle"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={isDrawerOpen}
        >
          <Menu strokeWidth={1.8} />
        </button>

        <div className="dashboard-sidebar-desktop">
          <Sidebar username={username ?? ""} />
        </div>

        <div className="sidebar-divider" />

        <div
          className={`drawer-backdrop ${isDrawerOpen ? "open" : ""}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        <div className={`dashboard-drawer ${isDrawerOpen ? "open" : ""}`}>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X strokeWidth={1.8} />
          </button>
          <Sidebar username={username ?? ""} onNavigate={() => setIsDrawerOpen(false)} />
        </div>

        <main className="dashboard-main">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
