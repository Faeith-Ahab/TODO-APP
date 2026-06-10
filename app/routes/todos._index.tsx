import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return redirect("/todos/pending");
}
