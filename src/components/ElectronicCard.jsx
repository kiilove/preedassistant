import { Card, Popconfirm, Tooltip, notification } from "antd";
import React, { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { useFirestoreDeleteData } from "../hooks/useFirestore";
import useImageUpload from "../hooks/useFireStorage";

const ElectronicCard = ({ data }) => {
  const navigate = useNavigate();
  const electronicsDelete = useFirestoreDeleteData();
  const deleteThumbnail = useImageUpload("/productPic/");
  const deleteDescrition = useImageUpload("/productDescrition/");
  const [popOpen, setPopOpen] = useState({ del: false });

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };

  const redirectItemUpdate = (propData) => {
    if (data) {
      navigate("/editelectronic", { state: { data: propData } });
    }
  };

  const deleteStorageFiles = (filesArray) => {
    console.log(filesArray);
    if (filesArray.length > 0) {
      filesArray.map(async (file, fIdx) => {
        await deleteThumbnail.deleteFileFromStorage(file.url);
        await deleteDescrition.deleteFileFromStorage(file.url);
      });
    }
  };

  const deleteElectronics = async (id, file) => {
    try {
      await electronicsDelete.deleteData("electronics", id, async () => {
        await deleteStorageFiles(file);
        setPopOpen({ ...popOpen, del: false });
        window.location.reload();
        openNotification(
          "info",
          "삭제알림",
          "제품이 삭제되었습니다.",
          "bottomLeft",
          3
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Tooltip title={data.productName}>
      <Card
        title={data.productName}
        size="small"
        style={{ width: "300px" }}
        actions={[
          <EditOutlined
            style={{ fontSize: "18px" }}
            onClick={() => redirectItemUpdate(data)}
          />,
          <DeleteOutlined
            style={{ fontSize: "18px" }}
            onClick={() => setPopOpen({ ...popOpen, del: true })}
          />,
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
                style={{
                  maxWidth: "150px",
                  width: "auto",
                  maxHeight: "120px",
                  height: "auto",
                }}
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
          <Popconfirm
            title="제품삭제"
            description="제품을 삭제하시겠습니까?"
            open={popOpen.del}
            okText="예"
            okType="default"
            cancelText="아니오"
            onConfirm={() =>
              deleteElectronics(data.id, [
                ...data.productThumbnail,
                ...data.productDescription,
              ])
            }
            onCancel={() => setPopOpen({ ...popOpen, del: false })}
          />
        </div>
      </Card>
    </Tooltip>
  );
};

export default ElectronicCard;
