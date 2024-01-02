import { Button, Card, Form, Input, Select, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  accountCounts,
  makerNames,
  productTypes,
  quillFormats,
  quillModules,
  sangjoList,
  vendorList,
} from "../consts";
import { generateUUID } from "../functions";
import ProductFinder from "../components/ProductFinder";
import { useFirestoreAddData } from "../hooks/useFirestore";

const NewItem = () => {
  const [itemUnion, setItemUnion] = useState(false);
  const [filteredSangjo, setFilteredSangjo] = useState([]);
  const [productList, setProductList] = useState([]);

  const itemRef = useRef();
  const itemAdd = useFirestoreAddData();

  const initItemForm = (ref) => {
    ref?.current.resetFields();
    ref?.current.setFieldsValue({
      itemUid: generateUUID(),
      itemIsActive: true,
      itemIsUnion: false,
    });
    setItemUnion(false);

    setProductList([]);
  };

  const handleItemUnion = (value) => {
    setItemUnion(value);
  };

  const handleFilterSangjo = (propSangjo) => {
    if (propSangjo) {
      itemRef?.current.setFieldsValue({
        ...itemRef?.current.getFieldsValue(),
        itemSangjo: "",
      });
      const fileterd = sangjoList.filter((f) => f.refVendor === propSangjo);
      setFilteredSangjo([...fileterd]);
    }
  };

  const itemFinished = async (value) => {
    let newValue = { ...value };

    if (productList?.length > 0) {
      newValue = { ...newValue, productList };
    }

    try {
      await itemAdd.addData("sangjos", { ...newValue }, (data) => {
        initItemForm(itemRef);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initItemForm(itemRef);
  }, []);

  return (
    <div className="flex w-full h-full bg-white rounded-lg p-5">
      <Card title="상품등록" style={{ minWidth: "600px" }}>
        <Form
          ref={itemRef}
          onFinish={itemFinished}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
        >
          <Form.Item name="itemUid" label="관리번호">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="itemVendor"
            label="판매사"
            rules={[{ required: true, message: "판매사를 선택하세요" }]}
          >
            <Select
              allowClear
              options={[...vendorList]}
              onChange={(value) => handleFilterSangjo(value)}
            />
          </Form.Item>
          <Form.Item
            name="itemSangjo"
            label="상조상품"
            rules={[{ required: true, message: "상조상품을 선택하세요" }]}
          >
            <Select allowClear options={[...filteredSangjo]} />
          </Form.Item>
          <Form.Item name="itemIsActive" label="판매여부">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item
            name="itemName"
            label="상품명"
            rules={[{ required: true, message: "상품명은 반드시 필요합니다." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="accountCount"
            label="필요구좌"
            rules={[{ required: true, message: "구좌수를 선택하세요" }]}
          >
            <Select allowClear options={[...accountCounts]} />
          </Form.Item>
          <Form.Item name="itemIsUnion" label="결합상품">
            <Switch onChange={handleItemUnion} />
          </Form.Item>
          <div className={itemUnion ? "flex pb-5" : "hidden"}>
            {ProductFinder(productList, setProductList)}
          </div>
          <div className="flex gap-x-2">
            <Button htmlType="submit">상품등록</Button>
            <Button onClick={() => initItemForm(itemRef)}>초기화</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewItem;
