import React, { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

// 페이지 컴포넌트들을 import 합니다.
import Main from "./pages/Main";
import NewItem from "./pages/NewItem";
import NewElectronicProduct from "./pages/NewElectronicProduct";
import ElectronicList from "./pages/ElectronicList";
import EditProduct from "./pages/EditProduct";
import ItemList from "./pages/ItemList";
import PostByQuill from "./components/PostByQuill";
import UserList from "./pages/UserList";
import NewLocationHub from "./pages/NewLocationHub";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import NormalUserDashboard from "./pages/NormalUserDashboard";
import useFirebaseAuth from "./hooks/useFireAuth";
import { LoginContext, LoginProvider } from "./context/LoginContext";

function App() {
  // 보호된 라우트 컴포넌트
  const ProtectedRoute = ({ children }) => {
    const { loginStatus } = useContext(LoginContext);
    const navigate = useNavigate();
    console.log(loginStatus);
    useEffect(() => {
      const timer = setTimeout(() => {
        if (!loginStatus?.userAuthUid) {
          navigate("/userlogin");
        }
      }, 1000); // 1초 후 로그인 상태 확인

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [loginStatus]);

    return children;
  };

  return (
    <LoginProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newitem"
            element={
              <ProtectedRoute>
                <Main children={<NewItem />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newelectronicproduct"
            element={
              <ProtectedRoute>
                <Main children={<NewElectronicProduct />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/electroniclist"
            element={
              <ProtectedRoute>
                <Main children={<ElectronicList />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editproduct"
            element={
              <ProtectedRoute>
                <Main children={<EditProduct />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itemlist"
            element={
              <ProtectedRoute>
                <Main children={<ItemList />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productpost"
            element={
              <ProtectedRoute>
                <Main children={<PostByQuill />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userlist"
            element={
              <ProtectedRoute>
                <Main children={<UserList />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newlocationhub"
            element={
              <ProtectedRoute>
                <Main children={<NewLocationHub />} />
              </ProtectedRoute>
            }
          />
          <Route path="/userregister" element={<UserRegister />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route
            path="/ndashboard"
            element={
              <ProtectedRoute>
                <NormalUserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </LoginProvider>
  );
}

export default App;
