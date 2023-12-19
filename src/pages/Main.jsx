import { Button, Layout, Menu, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
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
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "제품등록",
              onClick: () => {
                navigate("/newproduct");
              },
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "제품목록",
              onClick: () => {
                navigate("/productlist");
              },
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "상품등록",
              onClick: () => {
                navigate("/productpost");
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
