import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import NewProduct from "./pages/NewProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/newproduct"
          element={<Main children={<NewProduct />} />}
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
