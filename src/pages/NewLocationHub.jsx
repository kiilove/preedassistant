import { Card, Form, Input } from "antd";
import React, { useEffect, useRef } from "react";
import { generateUUID } from "../functions";

const NewLocationHub = () => {
  const locationRef = useRef();

  const locationFinished = (value) => {
    console.log(value);
  };

  const initItemForm = (ref) => {
    ref?.current.resetFields();
    ref?.current.setFieldsValue({
      locationUid: generateUUID(),
    });
  };

  useEffect(() => {
    initItemForm(locationRef);
  }, []);
  return (
    <div className="flex w-full h-full bg-white rounded-lg p-5">
      <Card title="지점등록" style={{ minWidth: "600px" }}>
        <Form
          ref={locationRef}
          onFinish={locationFinished}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
        >
          <Form.Item name="locationUid" label="관리번호">
            <Input disabled />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewLocationHub;
