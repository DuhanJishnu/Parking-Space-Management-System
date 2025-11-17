import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/Login.tsx"),
    route("/home", "routes/Home.tsx"),
    route("/select-vehicle", "routes/SelectVehicle.tsx"),
    route("/fetch-vehicle", "routes/FetchVehicle.tsx"),
    route("/details/","routes/Details.tsx"),
    route("/available","routes/Available_Slots.tsx"),
    route("/add-vehicle", "routes/AddVehicle.tsx")
] satisfies RouteConfig;

