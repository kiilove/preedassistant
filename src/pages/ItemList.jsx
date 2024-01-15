import { Button, Card, Divider, Form, Input, Space } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import ItemCard from "../components/ItemCard";

const ItemList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    isActive: "all",
    accountCount: "all",
    keyword: "",
  });

  const firestoreGet = useFirestoreQuery();

  const filteredData = useMemo(() => {
    let filtered = [...products];

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
    products,
  ]);

  const fetchedData = async () => {
    try {
      await firestoreGet.getDocuments("sangjos", (data) => {
        setProducts([...data]);
        setFilteredItems([...data]);
        setIsLoading(false);
      });
      // console.log(fetched);
      // if (fetched.length > 0) {
      //   setProducts(() => [...fetched]);
      // }
    } catch (error) {
      console.log(error);
    }
  };

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
            {filteredData?.length > 0 &&
              filteredData.map((filter, fIdx) => {
                console.log(filter);
                return <ItemCard key={fIdx} data={filter} />;
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default ItemList;
