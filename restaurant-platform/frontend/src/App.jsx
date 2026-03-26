import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./screens/AppRoutes";
import Navigate from "./components/Navigate";
import Footer from "./components/Footer";
import FloatingCartButton from "./components/FloatingCartButton";
import AllergyModal from "./components/AllergyModal";
import NotificationPopup from "./components/NotificationPopup";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(216,180,254,0.35),_transparent_28%),linear-gradient(180deg,_#faf5ff_0%,_#fdf4ff_36%,_#ffffff_100%)] text-slate-900">
          <Navigate />
          <AppRoutes />
          <Footer />
          <FloatingCartButton />
          <AllergyModal />
          <NotificationPopup />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
