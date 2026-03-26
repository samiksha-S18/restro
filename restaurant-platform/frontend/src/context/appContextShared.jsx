import { createContext, useContext } from "react";

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function getDefaultRouteForRole(role) {
  if (role === "super_admin") {
    return "/super-admin";
  }

  if (role === "restaurant_admin") {
    return "/restaurant-admin";
  }

  return "/profile";
}
