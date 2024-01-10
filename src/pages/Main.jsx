import { Button, Layout, Menu, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { ImLocation2 } from "react-icons/im";
import { CiViewList } from "react-icons/ci";
import {
  MdAddBusiness,
  MdOutlineAddToQueue,
  MdOutlineFormatListBulleted,
  MdListAlt,
} from "react-icons/md";
import { IoMdSettings, IoIosLogOut } from "react-icons/io";
import Sider from "antd/es/layout/Sider";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";

import { LoginContext } from "../context/LoginContext";
import useFirebaseAuth from "../hooks/useFireAuth";

const Main = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logOut } = useFirebaseAuth();
  const { currentUserInfo } = useContext(LoginContext);

  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    try {
      await logOut().then(() => {
        localStorage.removeItem("locationTimeStamp");
        navigate("/userlogin");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="flex w-full h-20 justify-center items-center">
          <span
            className="text-white font-semibold font-serif"
            style={{ fontSize: "40px" }}
          >
            PAS
          </span>
        </div>
        <Button
          type="text"
          icon={
            collapsed ? (
              <MenuUnfoldOutlined className="text-white" />
            ) : (
              <MenuFoldOutlined className="text-white" />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Menu
          theme="dark"
          mode="inline"
          className="text-base font-semibold "
          items={[
            {
              key: "1",
              icon: <MdAddBusiness style={{ fontSize: "20px" }} />,
              label: "상품등록",
              onClick: () => {
                navigate("/newitem");
              },
            },
            {
              key: "2",
              icon: (
                <MdOutlineFormatListBulleted style={{ fontSize: "20px" }} />
              ),
              label: "상품목록",
              onClick: () => {
                navigate("/itemlist");
              },
            },
            {
              key: "3",
              icon: <MdOutlineAddToQueue style={{ fontSize: "20px" }} />,
              label: "가전제품등록",
              onClick: () => {
                navigate("/newelectronicproduct");
              },
            },
            {
              key: "4",
              icon: <MdListAlt style={{ fontSize: "20px" }} />,
              label: "가전제품목록",
              onClick: () => {
                navigate("/electroniclist");
              },
            },
            {
              key: "5",
              icon: <UserOutlined style={{ fontSize: "20px" }} />,
              label: "유저목록",
              onClick: () => {
                navigate("/userlist");
              },
            },
            {
              key: "6",
              icon: <ImLocation2 style={{ fontSize: "20px" }} />,
              label: "지점등록",
              onClick: () => {
                navigate("/newlocationhub");
              },
            },
          ]}
        ></Menu>
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: colorBgContainer }}>
          <div className="flex w-full justify-end px-5 items-center gap-x-2">
            <div className="flex">{currentUserInfo?.userName}님</div>
            <button className="flex">
              <IoMdSettings
                className="text-gray-500"
                style={{ fontSize: "25px" }}
              />
            </button>
            <button className="flex" onClick={() => handleLogout()}>
              <IoIosLogOut
                className="text-gray-500"
                style={{ fontSize: "25px" }}
              />
            </button>
            {/* <Button onClick={() => logOut()}>로그아웃</Button> */}
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            minHeight: 280,
          }}
          className=" rounded-lg"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
