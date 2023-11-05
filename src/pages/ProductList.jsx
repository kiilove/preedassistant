import { Button, Card, Divider, Form, Input, Space } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    isActive: "all",
    accountCount: "all",
    keyword: "",
  });
  const firestoreGet = useFirestoreQuery();

  const FileterdProducts = useMemo(() => {
    let activeQuery = searchQuery.isActive;
    let accountQuery = searchQuery.accountCount;
    let keywordQuery = searchQuery.keyword;
    let queryArray = [];

    if (products?.length > 0) {
      const filteredData = products.filter((f) => {
        if (activeQuery !== "all" && accountQuery !== "all") {
          return (
            f.itemIsActive === activeQuery && f.accountCount === accountQuery
          );
        } else if (activeQuery !== "all") {
          return f.itemIsActive === activeQuery;
        } else if (accountQuery !== "all") {
          return f.accountCount === accountQuery;
        }
        // activeQuery와 accountQuery가 모두 "all"일 때는 모든 항목을 포함
        return true;
      });

      return filteredData;
    }

    // if (activeQuery !== "all") {
    //   queryArray.push(where("itemIsActive", "==", activeQuery));
    // }

    // if (accountQuery !== "all") {
    //   queryArray.push(where("accountCount", "==", accountQuery));
    // }
  }, [searchQuery, products]);

  const fetchedData = async () => {
    try {
      await firestoreGet.getDocuments("products", (data) => {
        setProducts([...data]);
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
    console.log(FileterdProducts);
    setIsLoading(false);
  }, [FileterdProducts]);

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
                  <Input />
                </Space>
              </Card>
              <div
                className="flex h-full justify-center items-center"
                style={{ minHeight: "95px" }}
              >
                <Button
                  className="h-full bg-blue-500 text-white font-medium text-base"
                  style={{ minHeight: "95px", minWidth: "90px" }}
                >
                  검색
                </Button>
              </div>
            </Space>
            <div className="flex justify-start items-center"></div>
          </div>
          <div className="flex w-full h-auto bg-white rounded-lg p-2 gap-2">
            {FileterdProducts?.length > 0 &&
              FileterdProducts.map((filter, fIdx) => (
                <ProductCard key={fIdx} data={filter} />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
