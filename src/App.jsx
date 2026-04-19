import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/Landing/BottomNav";

import Landing  from "./pages/Landing";
import SearchPage from "./pages/SearchPage";
import Cards    from "./pages/Cards";
import Voucher  from "./pages/Voucher";
import FreeFire from "./pages/FreeFire";
import Flipkart from "./pages/Flipkart";
import Amazon   from "./pages/Amazon";
import Shein    from "./pages/Shein";
import Account  from "./pages/Account";
import Orders   from "./pages/Orders";
import Auth     from "./pages/Auth";
import Admin    from "./pages/Admin";

// BottomNav sirf kuch pages par dikhega
const SHOW_NAV = ["/", "/search", "/orders", "/account"];

const Layout = () => {
  const location = useLocation();
  const showNav = SHOW_NAV.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/search"   element={<SearchPage />} />
        <Route path="/cards"    element={<Cards />} />
        <Route path="/voucher"  element={<Voucher />} />
        <Route path="/freefire" element={<FreeFire />} />
        <Route path="/flipkart" element={<Flipkart />} />
        <Route path="/amazon"   element={<Amazon />} />
        <Route path="/shein"    element={<Shein />} />
        <Route path="/login"    element={<Auth />} />
        <Route path="/admin"    element={<Admin />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {showNav && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;