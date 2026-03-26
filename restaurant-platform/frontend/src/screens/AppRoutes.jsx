import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Restaurants from "../pages/Restaurants";
import RestaurantDetails from "../pages/RestaurantDetails";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import ReservationPage from "../pages/ReservationPage";
import RestaurantAdminPanel from "../pages/RestaurantAdminPanel";
import SuperAdminPanel from "../pages/SuperAdminPanel";
import { ProtectedRoute, RestaurantAdminRoute, SuperAdminRoute, UserRoute } from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserRoute><Home /></UserRoute>} />
      <Route path="/restaurants" element={<UserRoute><Restaurants /></UserRoute>} />
      <Route path="/restaurant/:id" element={<UserRoute><RestaurantDetails /></UserRoute>} />
      <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
      <Route path="/reservation" element={<UserRoute><ReservationPage /></UserRoute>} />
      <Route path="/restaurant-admin" element={<RestaurantAdminRoute><RestaurantAdminPanel /></RestaurantAdminRoute>} />
      <Route path="/super-admin" element={<SuperAdminRoute><SuperAdminPanel /></SuperAdminRoute>} />
    </Routes>
  );
}

export default AppRoutes;
