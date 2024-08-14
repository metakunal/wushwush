import "boxicons";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AllBonds from "./pages/AllBonds";
import AllStocks from "./pages/AllStocks";
import Bonds from "./pages/Bonds";
import Dashboard from "./pages/Dashboard";
import OrderBook from "./pages/OrderBook";
import Stocks from "./pages/Stocks";
import TradeFlowBook from "./pages/TradeFlowBook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/tradeflowbook" element={<TradeFlowBook />} />
        <Route exact path="/orderbook" element={<OrderBook />} />
        <Route exact path="/stocks" element={<Stocks />} />
        <Route exact path="/bonds" element={<Bonds />} />
        <Route exact path="/allstocks" element={<AllStocks />} />
        <Route exact path="/allbonds" element={<AllBonds />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
