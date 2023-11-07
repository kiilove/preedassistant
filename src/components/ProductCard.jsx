import { Card, Tooltip } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ data }) => {
  const navigate = useNavigate(null);
  let thumbnail = <div></div>;
  let spec = <div></div>;

  if (!data) {
    return;
  }

  if (data.productList?.length === 1) {
    thumbnail = (
      <div className="flex w-full h-32 justify-center items-center">
        <img
          src={data.productList[0].productPic[0].url}
          alt=""
          className="w-auto object-cover"
          style={{ maxWidth: "180px", maxHeight: "140px" }}
        />
      </div>
    );
    spec = (
      <div className="flex justify-start items-start flex-col h-full w-full">
        <span className="px-4">[{data.productList[0].productType}]</span>
        <ReactQuill
          readOnly
          theme="bubble"
          value={JSON.parse(data.productList[0].productInfomation)}
          style={{ minHeight: "180px", maxHeight: "200px" }}
        />
      </div>
    );
  } else {
    console.log(data?.productList);
    thumbnail = (
      <div className="flex w-auto h-28 justify-center items-center">
        {data?.productList?.map((product, pIdx) => {
          const { productPic } = product;
          const url = productPic[0].url;

          return (
            <div key={pIdx} className="flex">
              <img
                src={url}
                className="w-auto object-fit"
                style={{ maxWidth: "180px", maxHeight: "180px" }}
              />
              <div
                className={
                  data?.productList?.length !== pIdx + 1
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
      <div className="flex w-full h-28 justify-center items-center">
        {data?.productList?.map((product, pIdx) => {
          const { productInfomation, productType, productUid } = product;
          const quillValue = JSON.parse(productInfomation);

          return (
            <div
              key={pIdx}
              className="flex justify-start items-start flex-col h-full w-full gap-2 "
            >
              <span className="px-4 ">[{productType}]</span>
              <ReactQuill
                readOnly
                theme="bubble"
                value={quillValue}
                style={{ minHeight: "180px", maxHeight: "200px" }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  const redirectItemUpdate = (propData) => {
    if (data) {
      navigate("/editproduct", { state: { data: propData } });
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
          <DeleteOutlined style={{ fontSize: "20px" }} />,
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
          <div className="flex w-full" style={{ height: "140px" }}>
            {spec}
          </div>
        </div>
      </Card>
    </Tooltip>
  );
};

export default ProductCard;
