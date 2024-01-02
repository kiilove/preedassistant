import { Card, Empty } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

const ElectronicProductPreview = ({ list }) => {
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
              <Card
                className="w-full"
                title={
                  <div className="w-full flex justify-center">
                    {productVendor + " / " + productType}
                  </div>
                }
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
                    {productVendor} {productName}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ElectronicProductPreview;
