import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/Login.tsx"),
    route("/home", "routes/Home.tsx"),
    route("/park-vehicle", "routes/SelectVehicle.tsx"),
    route("/fetch-vehicle", "routes/FetchVehicle.tsx"),
    route("/details/:v_type","routes/Details.tsx"),
    route("/available","routes/Available_Slots.tsx")
] satisfies RouteConfig;

