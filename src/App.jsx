import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Cards from "./pages/Cards";
import Voucher from "./pages/Voucher";
import FreeFire from "./pages/FreeFire";
import Flipkart from "./pages/Flipkart";
import Amazon from "./pages/Amazon";
import Shein from "./pages/Shein";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/freefire" element={<FreeFire />} />
        <Route path="/flipkart" element={<Flipkart />} />
        <Route path="/amazon" element={<Amazon />} />
        <Route path="/shein" element={<Shein />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;