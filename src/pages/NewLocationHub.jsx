import { Button, Card, Form, Input, Space } from "antd";
import React, { useEffect, useRef } from "react";
import { formatPhoneNumber, generateUUID } from "../functions";
import { useDaumPostcodePopup } from "react-daum-postcode";

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

  const handlePhoneNumber = (value) => {
    locationRef?.current.setFieldsValue({
      ...locationRef?.current.getFieldsValue(),
      locationTelNumber: formatPhoneNumber(value),
    });
  };

  const scriptUrl =
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleZoneFindComplete = (data) => {
    console.log(data);
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    if (fullAddress !== "") {
      locationRef?.current.setFieldsValue({
        ...locationRef?.current.getFieldsValue(),
        locationZoneCode: data.zonecode,
        locationAddress: data.address,
        locationExtraAddress: data.buildingName,
        locationSido: data.sido,
        locationSiGunGu: data.sigungu,
      });
    }
  };

  const handleZoneFindClick = () => {
    open({ onComplete: handleZoneFindComplete });
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
          <Form.Item name="locationName" label="지점명">
            <Input />
          </Form.Item>
          <Form.Item name="locationLeader" label="지점장">
            <Space direction="horizontal">
              <Form.Item noStyle>
                <Space.Compact>
                  <Input />
                  <Button>검색</Button>
                </Space.Compact>
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="locationTelNumber" label="연락처">
            <Input onChange={(e) => handlePhoneNumber(e.target.value)} />
          </Form.Item>

          <Form.Item name="locationZoneCode" label="우편번호">
            <Input
              style={{ width: "80px" }}
              readOnly
              onClick={() => handleZoneFindClick()}
            />
          </Form.Item>
          <Form.Item name="locationSido" hidden></Form.Item>
          <Form.Item name="locationSiGunGu" hidden></Form.Item>
          <Form.Item name="locationAddress" label="주소">
            <Input />
          </Form.Item>
          <Form.Item name="locationExtraAddress" label="상세주소">
            <Input />
          </Form.Item>
          <Space>
            <Button htmlType="submit">저장</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default NewLocationHub;
