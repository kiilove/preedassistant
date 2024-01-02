import { Button, Layout, Menu, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { CiViewList } from "react-icons/ci";
import {
  MdAddBusiness,
  MdOutlineAddToQueue,
  MdOutlineFormatListBulleted,
  MdListAlt,
} from "react-icons/md";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";

const Main = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
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
          ]}
        ></Menu>
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
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
