import { Button, Card, Form, Input, Select, Switch, notification } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { accountCounts, sangjoList, vendorList } from "../consts";
import { generateUUID } from "../functions";
import ProductFinder from "../components/ProductFinder";
import {
  useFirestoreAddData,
  useFirestoreGetDocument,
  useFirestoreUpdateData,
} from "../hooks/useFirestore";
import { useLocation } from "react-router-dom";
import { init } from "canvas-to-blob";

const EditItem = () => {
  const [itemUnion, setItemUnion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredSangjo, setFilteredSangjo] = useState([]);
  const [productList, setProductList] = useState([]);

  const itemUpdate = useFirestoreUpdateData();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };

  const itemRef = useRef();
  const itemAdd = useFirestoreAddData();

  const initItemForm = (ref) => {
    ref?.current.resetFields();
    ref?.current.setFieldsValue({
      itemUid: generateUUID(),
      itemIsActive: true,
      itemIsUnion: false,
      itemIndex: 0,
    });
    setItemUnion(false);

    setProductList([]);
  };

  const handleInitItemForm = (ref, value) => {
    const initFormValue = { ...value };
    delete initFormValue.productIdList;
    delete initFormValue.productInfo;

    if (initFormValue?.itemUid) {
      ref?.current.setFieldsValue({ ...initFormValue });
      setProductList(() => [...value.productInfo]);
      setItemUnion(initFormValue.itemIsUnion);
    }
  };

  const handleItemTitle = (data) => {
    let itemTitle = "";
    if (data?.length === 0) {
      return;
    }

    if (data?.length === 1) {
      itemTitle = data[0].productName;
    }

    if (data?.length > 1) {
      data.map((item, idx) => {
        const { productName } = item;
        if (data?.length === idx + 1) {
          itemTitle = itemTitle + productName;
        } else {
          itemTitle = itemTitle + productName + "+";
        }
      });
    }

    return itemTitle;
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

  const handleUpdateItem = async (propId, value) => {
    try {
      await itemUpdate.updateData("sangjos", propId, { ...value }, () => {
        openNotification(
          "success",
          "상품수정알림",
          "상품이 정상적으로 수정되었습니다.",
          "bottomLeft",
          3
        );
      });
    } catch (error) {}
  };

  const itemFinished = (value) => {
    let newValue = { ...value };

    if (productList?.length > 0) {
      const productIdList = productList.map((product, pIdx) => {
        return product.id;
      });
      newValue = { ...newValue, productIdList };
    }
    handleUpdateItem(location.state.data.id, { ...newValue });

    // try {
    //   await itemAdd.addData("sangjos", { ...newValue }, () => {
    //     initItemForm(itemRef);
    //     openNotification(
    //       "success",
    //       "상품등록알림",
    //       "상품이 정상적으로 수정되었습니다.",
    //       "bottomLeft",
    //       3
    //     );
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    initItemForm(itemRef);
  }, []);

  useEffect(() => {
    if (location?.state?.data) {
      handleInitItemForm(itemRef, location.state.data);
    }
  }, [location]);

  useEffect(() => {
    itemRef?.current.setFieldsValue({
      ...itemRef?.current.getFieldsValue(),
      itemName: handleItemTitle(productList),
    });
  }, [productList]);

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
          <Form.Item name="itemIsActive" label="판매여부">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item name="itemIsUnion" label="결합상품">
            <Switch onChange={handleItemUnion} />
          </Form.Item>
          <div className={itemUnion ? "flex pb-5" : "hidden"}>
            {ProductFinder(productList, setProductList)}
          </div>
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

          <div className="flex gap-x-2">
            <Button htmlType="submit">수정</Button>
            <Button onClick={() => initItemForm(itemRef)}>초기화</Button>
          </div>
        </Form>
      </Card>
      {contextHolder}
    </div>
  );
};

export default EditItem;
