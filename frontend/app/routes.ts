import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/Login.tsx"),
    route("/home", "routes/Home.tsx"),
    route("/select-vehicle", "routes/SelectVehicle.tsx"),
    route("/fetch-vehicle", "routes/FetchVehicle.tsx"),
    route("/details/","routes/Details.tsx"),
    route("/add-vehicle", "routes/AddVehicle.tsx"),
    route("/available-slots", "routes/Available_Slots.tsx"),
    route("/bills", "routes/BillingPage.tsx"),
] satisfies RouteConfig;

