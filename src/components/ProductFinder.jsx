import React, { useEffect, useRef, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { Button, Form, Select } from "antd";
import { makerNames, productTypes } from "../consts";
import ElectronicProductPreview from "./ElectronicProductPreview";

const ProductFinder = (prevList, setPrevList, prevRefresh) => {
  const [productList, setProductList] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [currentProducts, setCurrentProducts] = useState([...prevList]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [filterProductType, setFilterProductType] = useState(undefined);
  const [filterProductVendor, setFilterProductVendor] = useState(undefined);
  const [filterProductName, setFilterProductName] = useState([]);
  const filterRef = useRef();

  const firestoreFetchs = useFirestoreQuery();
  const fetchAllProducts = async () => {
    try {
      await firestoreFetchs.getDocuments("electronics", (data) => {
        setProductList([...data]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilters = (keys, values, list) => {
    console.log(list);
    const filtered = list.filter((f) => {
      return keys.every((key, index) => {
        return f[key] === values[index];
      });
    });

    if (filtered?.length > 0) {
      const filteredProductName = filtered.map((filter, fIdx) => {
        const { id, productName } = filter;
        return { value: id, label: productName };
      });
      setFilterProductName(filteredProductName);
      setFilteredProductList(filtered);
    }
  };

  const handleCurrentProduct = (value, list) => {
    const newCurrent = list.find((f) => f.id === value);

    setCurrentProduct({ ...newCurrent });
  };

  const handleCurrentProducts = (value, list) => {
    if (value) {
      const newList = [...list];
      newList.push({ ...value });

      setPrevList([...newList]);
      setFilteredProductList([...productList]);
      setFilterProductType(undefined);
      setFilterProductVendor(undefined);
      setFilterProductName([]);
      setCurrentProduct({});
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    setFilteredProductList([...productList]);
  }, [productList]);

  useEffect(() => {
    console.log(filterProductType, filterProductVendor);
    if (filterProductType === undefined || filterProductVendor === undefined) {
      return;
    }

    handleFilters(
      ["productType", "productVendor"],
      [filterProductType, filterProductVendor],
      filteredProductList
    );
  }, [filterProductVendor, filterProductType]);

  useEffect(() => {
    if (firestoreFetchs.error !== null) {
      console.log(firestoreFetchs.error);
    }
  }, [firestoreFetchs.error]);

  return (
    <div className="flex w-full h-auto p-5 flex-col justify-start gap-y-2 border rounded-lg">
      <div className="flex w-full items-start gap-x-2">
        <Select
          name="productType"
          options={[...productTypes]}
          style={{ width: "120px" }}
          placeholder="종류"
          value={filterProductType}
          onChange={(value) => setFilterProductType(value)}
        />

        <Select
          placeholder="제조사"
          name="productVendor"
          options={[...makerNames]}
          style={{ width: "120px" }}
          value={filterProductVendor}
          onChange={(value) => setFilterProductVendor(value)}
          className={filterProductType === undefined ? "hidden" : null}
        />
      </div>
      <div className="flex w-full items-start gap-x-2">
        <Select
          placeholder="모델"
          name="productName"
          style={{ minWidth: "240px", width: "75%" }}
          options={[...filterProductName]}
          value={currentProduct?.productName}
          onChange={(value) => handleCurrentProduct(value, filteredProductList)}
          className={
            filterProductType === undefined || filterProductVendor === undefined
              ? "hidden"
              : null
          }
        />
      </div>
      <div
        className={
          currentProduct?.id ? "flex w-full items-start gap-x-2" : "hidden"
        }
      >
        <Button onClick={() => handleCurrentProducts(currentProduct, prevList)}>
          추가
        </Button>
      </div>
      <div className="flex w-full items-start gap-x-2">
        <ElectronicProductPreview list={[...prevList]} />
      </div>
    </div>
  );
};

export default ProductFinder;
