import React, { useEffect, useRef, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { Form, Select } from "antd";
import { makerNames, productTypes } from "../consts";

const ProductFinder = () => {
  const [productList, setProductList] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [filterProductType, setFilterProductType] = useState(undefined);
  const [filterProductVendor, setFilterProductVendor] = useState(undefined);
  const [filterProductName, setFilterProductName] = useState();
  const filterRef = useRef();
  const firestoreFetchs = useFirestoreQuery();
  const fetchAllProducts = async () => {
    try {
      await firestoreFetchs.getDocuments("products", (data) => {
        setProductList([...data]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilters = (filterKey, value) => {};

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    setFilteredProductList([...productList]);
  }, [productList]);

  useEffect(() => {
    if (firestoreFetchs.error !== null) {
      console.log(firestoreFetchs.error);
    }
  }, [firestoreFetchs.error]);

  return (
    <div className="flex w-full h-auto px-5 flex-col justify-start ">
      <div className="flex w-full items-start gap-x-2">
        <Select
          options={[...productTypes]}
          style={{ width: "120px" }}
          placeholder="종류"
          onChange={(value) => setFilterProductType(value)}
        />

        <Select
          placeholder="제조사"
          options={[...makerNames]}
          style={{ width: "120px" }}
          onChange={(value) => setFilterProductVendor(value)}
          className={filterProductType === undefined ? "hidden" : null}
        />
        <Select
          placeholder="모델"
          style={{ width: "120px" }}
          className={
            filterProductType === undefined || filterProductVendor === undefined
              ? "hidden"
              : null
          }
        />
      </div>
    </div>
  );
};

export default ProductFinder;
