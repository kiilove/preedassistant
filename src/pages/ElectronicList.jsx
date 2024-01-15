import { Button, Card, Divider, Form, Input, Select, Space } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import ElectronicCard from "../components/ElectronicCard";
import { groupByKey } from "../functions";

const ElectronicList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [vendorGroup, setVendorGroup] = useState([]);
  const [typeGroup, setTypeGroup] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    vendor: "all",
    type: "all",
    keyword: "",
  });
  const firestoreGet = useFirestoreQuery();

  const filteredData = useMemo(() => {
    let filtered = [...products];

    if (searchQuery.vendor !== "all") {
      // 문자열을 boolean으로 변환
      filtered = filtered.filter((f) => f.productVendor === searchQuery.vendor);
    }
    if (searchQuery.type !== "all") {
      filtered = filtered.filter((f) => f.productType === searchQuery.type);
    }

    //searchQuery.keyword에 따른 추가적인 필터링 (예시)
    if (searchQuery.keyword) {
      filtered = filtered.filter((f) =>
        f.productName.includes(searchQuery.keyword)
      );
    }

    return filtered;
  }, [searchQuery.vendor, searchQuery.type, searchQuery.keyword, products]);

  const fetchedData = async () => {
    try {
      await firestoreGet.getDocuments("electronics", (data) => {
        setProducts([...data]);
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
    if (products?.length > 0) {
      setVendorGroup(() => groupByKey(products, "productVendor"));
      setTypeGroup(() => groupByKey(products, "productType"));
    }
  }, [products]);

  return (
    <>
      {isLoading ? (
        <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg"></div>
      ) : (
        <div className="flex w-full h-full  rounded-lg flex-col gap-y-2">
          <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg">
            <Space>
              <Card title="종류" size="small">
                <Select
                  options={[...typeGroup]}
                  style={{ width: "100%", minWidth: "150px" }}
                  onChange={(value) =>
                    setSearchQuery(() => ({
                      ...searchQuery,
                      type: value,
                    }))
                  }
                />
              </Card>
              <Card title="제조사" size="small">
                <Select
                  options={[...vendorGroup]}
                  style={{ width: "100%", minWidth: "150px" }}
                  onChange={(value) =>
                    setSearchQuery(() => ({
                      ...searchQuery,
                      vendor: value,
                    }))
                  }
                />
              </Card>
              <Card title="모델명" size="small">
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
          <div className="flex w-full h-auto  rounded-lg p-2 gap-2 flex-wrap justify-evenly">
            {filteredData?.length > 0 &&
              filteredData.map((filter, fIdx) => (
                <ElectronicCard key={fIdx} data={filter} />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ElectronicList;
