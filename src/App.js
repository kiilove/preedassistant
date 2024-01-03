import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import NewProduct from "./pages/NewElectronicProduct";
import ProductList from "./pages/ProductList";
import EditProduct from "./pages/EditProduct";
import PostByQuill from "./components/PostByQuill";
import NewItem from "./pages/NewItem";
import NewElectronicProduct from "./pages/NewElectronicProduct";
import ElectronicList from "./pages/ElectronicList";
import ItemList from "./pages/ItemList";
import UserList from "./pages/UserList";
import NewLocationHub from "./pages/NewLocationHub";
import UserRegister from "./pages/UserRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/newitem" element={<Main children={<NewItem />} />} />
        <Route
          path="/newelectronicproduct"
          element={<Main children={<NewElectronicProduct />} />}
        />
        <Route
          path="/electroniclist"
          element={<Main children={<ElectronicList />} />}
        />
        <Route
          path="/editproduct"
          element={<Main children={<EditProduct />} />}
        />
        <Route path="/itemlist" element={<Main children={<ItemList />} />} />
        <Route
          path="/productpost"
          element={<Main children={<PostByQuill />} />}
        />
        <Route path="/userlist" element={<Main children={<UserList />} />} />
        <Route
          path="/newlocationhub"
          element={<Main children={<NewLocationHub />} />}
        />
        <Route path="/userregister" element={<UserRegister />} />
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
