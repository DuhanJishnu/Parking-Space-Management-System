import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/Home.tsx"),
    route("/details/:v_type","routes/Details.tsx"),
    route("/available","routes/Available_Slots.tsx")
] satisfies RouteConfig;

