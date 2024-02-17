import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Products from "./pages/Dashboard/Products";
import Orders from "./pages/Dashboard/Orders";
import Collections from "./pages/Dashboard/Collections";
import Coupons from "./pages/Dashboard/Coupons";
import CollectionPage from "./pages/CollectionPage";
import OrderPage from "./pages/OrderPage";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dashboard/products" element={<Products />} />
        <Route path="/dashboard/collections" element={<Collections />} />
        <Route path="/dashboard/coupons" element={<Coupons />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/collection/:collectionId" element={<CollectionPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
