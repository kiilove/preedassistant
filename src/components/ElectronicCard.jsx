import { Card, Tooltip } from "antd";
import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const ElectronicCard = ({ data }) => {
  const navigate = useNavigate();
  const redirectItemUpdate = (propData) => {
    if (data) {
      navigate("/editproduct", { state: { data: propData } });
    }
  };
  return (
    <Tooltip>
      <Card
        title={data.productName}
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
            style={{ height: "150px" }}
          >
            {data?.productThumbnail?.length > 0 ? (
              <img
                src={data.productThumbnail[0].url}
                style={{ maxWidth: "100px", width: "100%" }}
              />
            ) : null}
          </div>
          <div className="flex w-full bg-gray-300 h-8 justify-center items-center font-bold text-base border-y border-gray-500">
            {data.productVendor}[{data.productType}]
          </div>
          <div className="flex w-full h-full ">
            <TextArea
              value={data.productSpec}
              readOnly
              style={{ resize: "none", height: "100%", minHeight: "100px" }}
            />
          </div>
        </div>
      </Card>
    </Tooltip>
  );
};

export default ElectronicCard;
