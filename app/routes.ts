// import { type RouteConfig, index } from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;

// import { type RouteConfig, route } from "@react-router/dev/routes";

// export default [
//   route("home", "routes/home.tsx"),
// ] satisfies RouteConfig;

// import { type RouteConfig, index, route } from "@react-router/dev/routes";

// export default [
//   index("routes/_index.tsx"),
//   route("home", "routes/home.tsx"),
//   route("auth", "routes/auth.tsx"),
//   route("logout", "routes/logout.tsx"),

//   route("todos", "routes/todos.tsx", [
//     index("routes/todos._index.tsx"),
//     route("pending", "routes/todos.pending.tsx"),
//     route("new", "routes/todos.new.tsx"),
//     route("completed", "routes/todos.completed.tsx"),
//     route("deleted", "routes/todos.deleted.tsx"),
//     route("search", "routes/search.tsx"),
//     route("action", "routes/todos.action.tsx"),
//   ]),
// ] satisfies RouteConfig;


import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("auth", "routes/auth.tsx"),
  route("logout", "routes/logout.tsx"),

  route("todos", "routes/todos.tsx", [
    index("routes/todos._index.tsx"),
    route("pending", "routes/todos.pending.tsx"),
    route("new", "routes/todos.new.tsx"),
    route("completed", "routes/todos.completed.tsx"),
    route("deleted", "routes/todos.deleted.tsx"),
    route("search", "routes/todos.search.tsx"),
    route("action", "routes/todos.action.tsx"),
  ]),
] satisfies RouteConfig;