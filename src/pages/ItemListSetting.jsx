import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Empty, Input, Space, notification } from "antd";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestore";

import ItemTable from "../components/ItemTable";
import { TitleBasicType } from "../components/ComponentTitles";

const ItemListSetting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    isActive: "all",
    accountCount: "all",
    keyword: "",
  });
  const firestoreGet = useFirestoreQuery();
  const getElectronic = useFirestoreGetDocument();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };

  const filteredData = useMemo(() => {
    let filtered = [...filteredItems];

    if (searchQuery.isActive !== "all") {
      // 문자열을 boolean으로 변환
      filtered = filtered.filter(
        (f) => f.itemIsActive === searchQuery.isActive
      );
    }
    if (searchQuery.accountCount !== "all") {
      filtered = filtered.filter(
        (f) => f.accountCount === searchQuery.accountCount
      );
    }

    //searchQuery.keyword에 따른 추가적인 필터링 (예시)
    if (searchQuery.keyword) {
      filtered = filtered.filter((f) =>
        f.itemName.includes(searchQuery.keyword)
      );
    }

    return filtered;
  }, [
    searchQuery.isActive,
    searchQuery.accountCount,
    searchQuery.keyword,
    filteredItems,
  ]);

  const fetchedData = async () => {
    try {
      await firestoreGet.getDocuments("sangjos", (data) => {
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchedElectronic = async (id) => {
    let fetched = {};
    try {
      await getElectronic.getDocument("electronics", id, (data) => {
        if (data) {
          fetched = data;
        } else {
          openNotification(
            "error",
            "에러경고",
            "가전제품을 불러오는데 실패했습니다.",
            "bottomLeft",
            3
          );
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }

    return fetched;
  };
  useEffect(() => {
    const products = [...firestoreGet.data];
    if (products?.length > 0) {
      const itemAndElectronicJoin = products.map((product, pIdx) => {
        const { productIdList } = product;
        const productInfo = [];
        if (productIdList.length > 0) {
          productIdList.map(async (id, iIdx) => {
            const data = await fetchedElectronic(id);

            productInfo.push({ ...data });
          });
        }
        const joinedData = { ...product, productInfo };
        return joinedData;
      });

      setFilteredItems([...itemAndElectronicJoin]);
    }
  }, [firestoreGet.data]);

  useEffect(() => {
    fetchedData();
  }, []);

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);

  return (
    <>
      {isLoading ? (
        <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg"></div>
      ) : (
        <div className="flex w-full h-full  rounded-lg flex-col gap-y-2">
          <div className="flex">
            <TitleBasicType titleText={"베스트상품등록"} />
          </div>
          <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg">
            <Space>
              <Card title="판매여부" size="small">
                <Space>
                  <Button
                    className={
                      searchQuery.isActive === "all" &&
                      "bg-blue-500 text-white hover:text-white hover:bg-blue-100"
                    }
                    onClick={() => {
                      setSearchQuery(() => ({
                        ...searchQuery,
                        isActive: "all",
                      }));
                    }}
                  >
                    전체
                  </Button>
                  <Button
                    className={
                      searchQuery.isActive === true &&
                      "bg-blue-500 text-white hover:text-white hover:bg-blue-100"
                    }
                    onClick={() => {
                      setSearchQuery(() => ({
                        ...searchQuery,
                        isActive: true,
                      }));
                    }}
                  >
                    판매중
                  </Button>
                  <Button
                    className={
                      searchQuery.isActive === false &&
                      "bg-blue-500 text-white hover:text-white hover:bg-blue-100"
                    }
                    onClick={() => {
                      setSearchQuery(() => ({
                        ...searchQuery,
                        isActive: false,
                      }));
                    }}
                  >
                    판매중지
                  </Button>
                </Space>
              </Card>
              <Card title="구좌수" size="small">
                <Space>
                  <Button
                    className={
                      searchQuery.accountCount === "all" &&
                      "bg-blue-500 text-white hover:text-white hover:bg-blue-100"
                    }
                    onClick={() => {
                      setSearchQuery(() => ({
                        ...searchQuery,
                        accountCount: "all",
                      }));
                    }}
                  >
                    전체
                  </Button>
                  <Button
                    className={
                      searchQuery.accountCount === "1구좌" &&
                      "bg-blue-500 text-white hover:text-white hover:bg-blue-100"
                    }
                    onClick={() => {
                      setSearchQuery(() => ({
                        ...searchQuery,
                        accountCount: "1구좌",
                      }));
                    }}
                  >
                    1구좌
                  </Button>
                  <Button
                    className={
                      searchQuery.accountCount === "2구좌" &&
                      "bg-blue-500 text-white hover:text-white hover:bg-blue-100"
                    }
                    onClick={() => {
                      setSearchQuery(() => ({
                        ...searchQuery,
                        accountCount: "2구좌",
                      }));
                    }}
                  >
                    2구좌
                  </Button>
                  <Button
                    className={
                      searchQuery.accountCount === "3구좌" &&
                      "bg-blue-500 text-white hover:text-white hover:bg-blue-100"
                    }
                    onClick={() => {
                      setSearchQuery(() => ({
                        ...searchQuery,
                        accountCount: "3구좌",
                      }));
                    }}
                  >
                    3구좌
                  </Button>
                </Space>
              </Card>
              <Card title="검색어" size="small">
                <Space>
                  <Input
                    onChange={(e) =>
                      setSearchQuery(() => ({
                        ...searchQuery,
                        keyword: e.target.value.trim(),
                      }))
                    }
                  />
                </Space>
              </Card>
            </Space>
            <div className="flex justify-start items-center"></div>
          </div>
          <div className="flex w-full h-auto bg-white rounded-lg p-2 gap-2">
            {filteredData?.length > 0 ? (
              <ItemTable data={filteredData} />
            ) : (
              <div className="flex w-full h-full justify-center items-center">
                <Empty description="표시할 내용이 없습니다." />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ItemListSetting;
