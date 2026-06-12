import { Link, useLocation } from "react-router";


interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const location = useLocation();
  const authMode = new URLSearchParams(location.search).get("mode") ?? "login";
  const isAuth = location.pathname.startsWith("/auth");

  return (
    <div className="nav-wrap">
      <nav className="nav-pill">
        <Link
          to="/"
          className={`nav-link transition-colors ${
            location.pathname === "/"
              ? "text-[#4f4f4f]"
              : "text-[#4f4f4f]/80 hover:text-[#4f4f4f]"
          }`}
        >
          HOME
        </Link>
        <div className="nav-auth-links">
          <Link
            to={isLoggedIn ? "/todos" : "/auth?mode=login"}
            className={`nav-link transition-colors ${
              isAuth && authMode === "login"
                ? "text-[#4f4f4f]"
                : "text-[#4f4f4f]/80 hover:text-[#4f4f4f]"
            }`}
          >
            LOGIN
          </Link>
          <span className="nav-link nav-separator">/</span>
          <Link
            to={isLoggedIn ? "/todos" : "/auth?mode=signup"}
            className={`nav-link transition-colors ${
              isAuth && authMode === "signup"
                ? "text-[#4f4f4f]"
                : "text-[#4f4f4f]/80 hover:text-[#4f4f4f]"
            }`}
          >
            SIGNUP
          </Link>
        </div>
      </nav>
    </div>
  );
}
