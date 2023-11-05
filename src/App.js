import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import NewProduct from "./pages/NewProduct";
import ProductList from "./pages/ProductList";
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/newproduct"
          element={<Main children={<NewProduct />} />}
        />{" "}
        <Route
          path="/editproduct"
          element={<Main children={<EditProduct />} />}
        />
        <Route
          path="/productlist"
          element={<Main children={<ProductList />} />}
        />
        {/* <Route path="/test" element={<Main children={<AntdTest />} />} />
        <Route
          path="/customerlist"
          element={<Main children={<CustomerList />} />}
        />
        <Route
          path="/customernew"
          element={<Main children={<CustomerNew />} />}
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
