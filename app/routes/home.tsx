import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireUserId } from "~/lib/auth.server";
import { Navbar } from "~/components/Navbar";

export async function loader({ request }: LoaderFunctionArgs) {
  // If already authenticated, send them straight to their todos.
  await requireUserId(request);
  return redirect("/todos/pending");
}


export default function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="page-bg" />
      <div className="page-content min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="glass-card w-full max-w-4xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
            {/* Logo left */}
            <div className="flex-shrink-0">
              <div className="logo-font text-6xl md:text-7xl leading-none">TODO</div>
              <div className="logo-font text-6xl md:text-7xl leading-none">APP</div>
            </div>

            {/* Tagline right */}
            <div className="text-center md:text-left flex-1">
              <p className="text-white/85 text-xl md:text-2xl font-light leading-relaxed mb-4">
                A todo app, designed minimalist workspace that clears the digital clutter,
              </p>
              <p className="text-white/70 text-xl md:text-2xl italic font-light tracking-wide">
                FOCUS. CLARITY. FLOW
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
