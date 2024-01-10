import { Table } from "antd";

import React, { useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";

const UserList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [usersTableData, setUsersTableData] = useState([]);
  const usersQuery = useFirestoreQuery();

  const fetchData = async () => {
    try {
      await usersQuery.getDocuments("users", (data) => {
        setIsLoading(false);
        setFetchedUsers(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const makeTableData = (data) => {
      console.log(data);
      return data.map((user, uIdx) => {
        const {
          userName,
          userEmail,
          userPhoneNumber,
          userPic,
          userGender,
          userGrade,
          userLevel,
          userAccessToken,
        } = user;

        const dataField = {
          key: uIdx,
          userName,
          userEmail,
          userPhoneNumber,
          userPic,
          userGender,
          userGrade,
          userLevel,
          userAccessToken,
        };
        console.log(dataField);
        return dataField;
      });
    };

    if (fetchedUsers.length > 0) {
      setUsersTableData(makeTableData(fetchedUsers));
    }
  }, [fetchedUsers]);

  useEffect(() => {
    console.log(usersTableData);
  }, [usersTableData]);

  useEffect(() => {
    return () => {
      fetchData();
    };
  }, []);

  const userTableColumn = [
    { title: "이름", dataIndex: "userName", key: "userName" },
    { key: "userGender", title: "성별", dataIndex: "userGender" },
    { key: "userEmail", title: "이메일", dataIndex: "userEmail" },
    { key: "userPhoneNumber", title: "연락처", dataIndex: "userPhoneNumber" },
    { key: "userGrade", title: "등급", dataIndex: "userGrade" },
    { key: "userLevel", title: "권한", dataIndex: "userLevel" },
    { key: "userAccessToken", title: "토큰", dataIndex: "userAccessToken" },
  ];
  return (
    <>
      {isLoading ? (
        <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg"></div>
      ) : (
        <div className="flex w-full h-full  rounded-lg flex-col gap-y-2">
          <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg"></div>
          <div className="flex w-full h-auto bg-white rounded-lg p-2 gap-2">
            <Table
              columns={userTableColumn}
              dataSource={usersTableData}
              title={() => {
                return <span>유저목록</span>;
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
