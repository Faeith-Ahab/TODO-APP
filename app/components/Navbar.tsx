import { Link, useLocation } from "@remix-run/react";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const location = useLocation();

  return (
    <div className="flex justify-end px-6 pt-5">
      <nav className="nav-pill px-8 py-3 flex items-center gap-10">
        <Link
          to="/"
          className={`text-base font-medium tracking-widest uppercase transition-colors ${
            location.pathname === "/"
              ? "text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          HOME
        </Link>
        <Link
          to={isLoggedIn ? "/todos" : "/auth?mode=login"}
          className={`text-base font-medium tracking-widest uppercase transition-colors ${
            location.pathname.startsWith("/auth") || location.pathname.startsWith("/todos")
              ? "text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          LOGIN / SIGNUP
        </Link>
      </nav>
    </div>
  );
}
