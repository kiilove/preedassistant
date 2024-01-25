import { Card, Popconfirm, Tooltip, notification } from "antd";
import React, { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { useFirestoreDeleteData } from "../hooks/useFirestore";
import { useEffect } from "react";

const ItemTable = ({ data }) => {
  const navigate = useNavigate(null);
  const [popOpen, setPopOpen] = useState({ del: false });
  const delItem = useFirestoreDeleteData();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };
  const columns = [
    { title: "상품명", dataIndex: "itemName" },
    { title: "상조상품", dataIndex: "itemSangjo" },
    { title: "구좌수", dataIndex: "accountCount" },
    { title: "판매사", dataIndex: "itemVendor" },
    { title: "썸네일", dataIndex: "isThumbnail" },
    { title: "상세페이지", dataIndex: "isDescription" },
  ];
  const handleTableData = async (propData) => {
    // 0.5초 대기
    // productInfo 비동기 문제로 별짓을 다해봐도 안되어서 0.5초간 강제 대기
    await new Promise((resolve) => setTimeout(resolve, 500));

    const tableData = propData.map((d, dIdx) => {
      const { accountCount, itemName, itemSangjo, itemVendor, productInfo } = d;
      let isThumbnail = true;
      let isDescription = true;

      if (productInfo?.length > 0) {
        productInfo.forEach((info) => {
          if (info.productThumbnail.length > 0) {
            isThumbnail =
              isThumbnail &&
              info.productThumbnail.every((s) => s.url !== undefined);
          } else {
            isThumbnail = false;
          }

          if (info.productDescription.length > 0) {
            isDescription =
              isDescription &&
              info.productDescription.every((s) => s.url !== undefined);
          } else {
            isDescription = false;
          }
        });
      } else {
        isThumbnail = false;
        isDescription = false;
      }

      return {
        accountCount,
        itemName,
        itemSangjo,
        itemVendor,
        isThumbnail,
        isDescription,
      };
    });

    return tableData;
  };

  useEffect(() => {
    const processTableData = async () => {
      if (data?.length > 0) {
        const result = await handleTableData(data);
        console.log(result);
      }
    };

    processTableData();
  }, [data]);

  return <Tooltip title={data.itemName}></Tooltip>;
};

export default ItemTable;
