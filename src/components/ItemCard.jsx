import { Card, Popconfirm, Tooltip, notification } from "antd";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { useFirestoreDeleteData } from "../hooks/useFirestore";

const ItemCard = ({ data }) => {
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
  let thumbnail = <div></div>;
  let spec = <div></div>;

  if (!data) {
    return;
  }
  if (data.productInfo?.length === 0) {
    return;
  }
  if (data.productInfo?.length === 1) {
    thumbnail = (
      <div className="flex w-full h-32 justify-center items-center">
        <img
          src={data.productInfo[0].productThumbnail[0].url}
          alt=""
          className="w-auto object-cover"
          style={{ maxWidth: "180px", maxHeight: "140px" }}
        />
      </div>
    );
    spec = (
      <div className="flex justify-start items-start flex-col h-full w-full">
        <span className="px-4">[{data.productInfo[0].productType}]</span>
        <TextArea
          value={data.productInfo[0].productSpec}
          readOnly
          rows={5}
          style={{ resize: "none" }}
        />
      </div>
    );
  } else if (data.productInfo?.length > 1) {
    thumbnail = (
      <div className="flex w-auto h-28 justify-center items-center">
        {data?.productInfo?.map((product, pIdx) => {
          const { productThumbnail } = product;
          let url = "";
          if (productThumbnail?.length > 0) {
            url = productThumbnail[0]?.url;
          }

          return (
            <div key={pIdx} className="flex">
              <img
                src={url}
                className="w-auto object-fit"
                style={{ maxWidth: "180px", maxHeight: "180px" }}
              />
              <div
                className={
                  data?.productInfo?.length !== pIdx + 1
                    ? "w-auto text-3xl font-extrabold flex justify-center items-center h-28 text-red-600"
                    : "hidden"
                }
              >
                +
              </div>
            </div>
          );
        })}
      </div>
    );
    spec = (
      <div className="flex justify-start items-start flex-col h-full w-full">
        {data?.productInfo?.map((product, pIdx) => {
          const { productType, productSpec } = product;
          return (
            <>
              <span className="px-4">[{productType}]</span>
              <TextArea
                value={productSpec}
                readOnly
                rows={5}
                style={{ resize: "none" }}
              />
            </>
          );
        })}
      </div>
    );
  }

  const redirectItemUpdate = (propData) => {
    if (data) {
      navigate("/edititem", { state: { data: propData } });
    }
  };

  const deleteItem = async (id) => {
    try {
      await delItem.deleteData("sangjos", id, () => {
        setPopOpen({ ...popOpen, del: false });
        window.location.reload();
        openNotification(
          "info",
          "삭제알림",
          "상품이 삭제되었습니다.",
          "bottomLeft",
          3
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Tooltip title={data.itemName}>
      <Card
        style={{ maxWidth: 400, width: "100%" }}
        title={
          <div className="flex w-full justify-center">{data.accountCount}</div>
        }
        size="small"
        actions={[
          <EditOutlined
            style={{ fontSize: "20px" }}
            onClick={() => redirectItemUpdate(data)}
          />,
          <DeleteOutlined
            style={{ fontSize: "20px" }}
            onClick={() => setPopOpen({ ...popOpen, del: true })}
          />,
        ]}
      >
        <div className="flex w-full flex-col gap-y-2">
          <div
            className="flex w-full justify-center items-center"
            style={{ height: "200px" }}
          >
            {thumbnail}
          </div>
          <div className="flex w-full bg-gray-300 h-8 justify-center items-center font-bold text-base border-y border-gray-500">
            {data.itemName}
          </div>
          <div
            className="flex w-full"
            style={{ minheight: "140px", height: "100%" }}
          >
            {spec}
          </div>
          <Popconfirm
            title="상품삭제"
            description="상품을 삭제하시겠습니까?"
            open={popOpen.del}
            okText="예"
            okType="default"
            cancelText="아니오"
            onConfirm={() => deleteItem(data.id)}
            onCancel={() => setPopOpen({ ...popOpen, del: false })}
          />
        </div>
      </Card>
      {contextHolder}
    </Tooltip>
  );
};

export default ItemCard;
