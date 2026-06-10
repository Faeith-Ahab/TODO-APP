import { Outlet, useLoaderData } from "react-router";

import { requireUserId } from "~/lib/auth.server";
import { getUserById } from "~/lib/auth.service.server";
import { Sidebar } from "~/components/Sidebar";
import { useState } from "react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  return { username: user?.username };
}

export default function TodosLayout() {
  const { username } = useLoaderData<typeof loader>();

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="page-bg" />
      <div className="page-content min-h-screen flex">
        {/* Sidebar */}
        <Sidebar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Divider */}
        <div className="sidebar-divider my-6" />

        {/* Main content */}
        <div className="flex-1 flex flex-col p-6 min-w-0 overflow-hidden">
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
}
