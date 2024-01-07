import React, { createContext, useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { decryptData } from "../functions";
export const LoginContext = createContext({});

export const LoginProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState({});
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const fetchUserInfo = useFirestoreQuery();

  const fetchQuery = async (authUid) => {
    const condtionByUid = [where("userAuthUid", "==", authUid)];

    try {
      await fetchUserInfo.getDocuments(
        "users",
        (data) => {
          if (data.length > 0) {
            setCurrentUserInfo({ ...data[0] });
          }
        },
        condtionByUid
      );
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCurrentUserFromLocal = () => {
    const currentUser =
      JSON.parse(localStorage.getItem("locationTimeStamp")) || null;

    if (currentUser) {
      fetchQuery(
        decryptData(
          currentUser.owner,
          process.env.REACT_APP_LOCATION_SECRET_KEY
        )
      );
    }
  };

  useEffect(() => {
    if (!currentUserInfo?.userAuthUid) {
      return;
    }

    setLoginStatus({
      userAuthUid: currentUserInfo?.userAuthUid,
      userId: currentUserInfo?.id,
    });
  }, [currentUserInfo]);

  useEffect(() => {
    fetchCurrentUserFromLocal();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        loginStatus,
        setLoginStatus,
        currentUserInfo,
        setCurrentUserInfo,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
