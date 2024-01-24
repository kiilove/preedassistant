import { Card, Empty, Popconfirm } from "antd";
import TextArea from "antd/es/input/TextArea";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const ElectronicProductPreview = ({ list, setList }) => {
  const [popOpen, setPopOpen] = useState([false]);
  const handleRemoveElectronic = async (uid, propList, setProp) => {
    const newList = [...propList];
    const findIndex = newList.findIndex((f) => f.productUid === uid);
    newList.splice(findIndex, 1);
    setProp(() => [...newList]);
    setPopOpen([]);
  };

  const handlePopIndex = (index, value) => {
    const newPopOpen = [...popOpen];

    if (index !== undefined) {
      newPopOpen.splice(index, 1, value);
    }
    setPopOpen([...newPopOpen]);
  };
  return (
    <div className="w-full flex h-full">
      {list?.length === 0 ? (
        <Empty
          description={
            <span className="text-sm text-gray-400">제품을 추가해주세요</span>
          }
        />
      ) : (
        <div
          className="flex gap-2 flex-wrap w-full h-full justify-evenly"
          style={{ minWidth: "50%", maxWidth: "700px" }}
        >
          {list.map((product, pIdx) => {
            const {
              productThumbnail,
              productName,
              productUid,
              productVendor,
              productType,
              productSpec,
            } = product;
            return (
              <>
                <Card
                  className="w-full"
                  title={
                    <div className="w-full flex justify-center">
                      {productVendor + " / " + productType}
                    </div>
                  }
                  actions={[
                    <DeleteOutlined
                      style={{ fontSize: "20px" }}
                      onClick={() => handlePopIndex(pIdx, true)}
                    />,
                  ]}
                  cover={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center", // 수평 가운데 정렬
                        alignItems: "center", // 수직 가운데 정렬
                      }}
                    >
                      <img
                        src={productThumbnail[0].url}
                        className="p-2"
                        style={{
                          maxWidth: "100px",
                        }}
                      />
                    </div>
                  }
                  style={{
                    maxWidth: "200px",
                  }}
                >
                  <div className="flex flex-col">
                    <span className="flex text-sm font-semibold text-gray-600">
                      {productName}
                    </span>
                  </div>{" "}
                  <Popconfirm
                    title="상품삭제"
                    description="상품을 삭제하시겠습니까?"
                    open={popOpen[pIdx]}
                    okText="예"
                    okType="default"
                    cancelText="아니오"
                    onConfirm={() =>
                      handleRemoveElectronic(productUid, list, setList)
                    }
                    onCancel={() => handlePopIndex(pIdx, false)}
                  />
                </Card>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ElectronicProductPreview;
