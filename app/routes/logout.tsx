import { logout } from "~/lib/auth.server";

export async function action({ request }: { request: Request }) {
  return logout(request);
}


export async function loader() {
  return new Response(null, { status: 404 });
}
