import { Outlet, useLoaderData, useLocation } from "react-router";

import { requireUserId } from "~/lib/auth.server";
import { getUserById } from "~/lib/auth.service.server";
import { Sidebar } from "~/components/Sidebar";
import { useEffect, useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  return { username: user?.username };
}

export default function TodosLayout() {
  const { username } = useLoaderData<typeof loader>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (location.pathname === "/todos/search") {
      setSearchQuery(new URLSearchParams(location.search).get("q") ?? "");
    }
  }, [location.pathname, location.search]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="page-bg" />
      <div className="page-content min-h-screen flex">
        {/* Sidebar */}
        <Sidebar
          username={username ?? ""}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Divider */}
        <div className="sidebar-divider" />

        {/* Main content */}
        <div className="dashboard-main">
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
}
