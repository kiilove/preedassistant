import React, { useEffect, useState } from "react";
import { AiFillLock } from "react-icons/ai";
import { FaUser, FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useFirebaseAuth from "../hooks/useFireAuth";
import { notification } from "antd";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
const UserLogin = () => {
  const [inputId, setInputId] = useState();
  const [inputPwd, setInputPwd] = useState();
  const [currentUserInfo, setCurrentUserInfo] = useState({});

  const navigate = useNavigate();
  const emailLogin = useFirebaseAuth();
  const fetchQuery = useFirestoreQuery();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };
  const backgroudUrl =
    "https://firebasestorage.googleapis.com/v0/b/preed-manager.appspot.com/o/assets%2F45671.jpg?alt=media&token=d9e9eaa5-d7be-413b-bba0-37299667749a";

  const fetchUserInfo = async (userUid) => {
    const uidCondition = [where("userAuthUid", "==", userUid)];
    try {
      await fetchQuery.getDocuments(
        "users",
        (data) => {
          console.log(data);
          if (data.length > 0) {
            setCurrentUserInfo({ ...data[0] });
            navigate("/");
          }
        },
        uidCondition
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = async (id, pwd) => {
    try {
      await emailLogin.logInWithEmail(id.trim(), pwd.trim(), (user) => {
        const userUid = user.user.uid;
        console.log(user);

        fetchUserInfo(userUid);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin4 = async (id, pwd) => {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, id, pwd).then(() => navigate("/"));
  };

  useEffect(() => {
    console.log(currentUserInfo);
  }, [currentUserInfo]);

  useEffect(() => {
    if (emailLogin.authError !== null) {
      openNotification("error", "로그인오류", emailLogin.authError, "top");
    }
  }, [emailLogin.authError]);

  return (
    <div
      className="w-screen h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${backgroudUrl})` }}
    >
      <div
        className="flex flex-col items-center p-2 gap-y-10 md:p-5 bg-white md:rounded-lg w-full h-full md:w-5/6 md:h-5/6 lg:w-1/3"
        style={{
          maxWidth: "1000px",
          maxHeight: "650px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div
          className="flex w-full rounded-full justify-center items-center"
          style={{
            width: "180px",
            height: "180px",
            backgroundColor: "rgba(113, 217, 243, 1)",
          }}
        >
          <AiFillLock className="text-8xl text-gray-600" />
        </div>
        <div className="flex w-full ">
          <div className="flex w-full h-full flex-col px-20 gap-y-5">
            <div className="flex bg-white h-16 rounded-lg">
              <div
                className="flex h-full justify-center items-center"
                style={{ width: "100px" }}
              >
                <FaUser
                  className="text-gray-600"
                  style={{ fontSize: "30px" }}
                />
              </div>
              <div className="flex">
                <input
                  type="text"
                  className=" outline-none text-2xl"
                  onChange={(e) => setInputId(e.target.value)}
                />
              </div>
            </div>
            <div className="flex bg-white h-16 rounded-lg">
              <div
                className="flex h-full justify-center items-center"
                style={{ width: "100px" }}
              >
                <FaKey className="text-gray-600" style={{ fontSize: "30px" }} />
              </div>
              <div className="flex">
                <input
                  type="password"
                  className=" outline-none text-2xl"
                  onChange={(e) => setInputPwd(e.target.value)}
                />
              </div>
            </div>
            <div
              className="flex bg-white h-16 rounded-lg justify-center items-center cursor-pointer"
              style={{ backgroundColor: "rgba(113, 217, 243, 1)" }}
              onClick={() => handleLogin(inputId, inputPwd)}
            >
              <span
                className="text-xl font-semibold text-gray-700"
                style={{ letterSpacing: "10px", fontFamily: "Noto Sans KR" }}
              >
                로그인
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full px-20">
          <div className="flex w-full bg-white" style={{ height: "4px" }}></div>
        </div>
        <div className="flex w-full px-24 justify-between">
          <span className="text-gray-500">비밀번호찾기</span>
          <span
            className="text-gray-500 cursor-pointer hover:text-gray-800"
            onClick={() => navigate("/userregister")}
          >
            회원가입
          </span>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default UserLogin;
