import React, { useRef, useState } from "react";
import UniqueIdApply from "../components/UniqueIdApply";
import { Button, Form, Input, Radio, Space, Steps } from "antd";
import { Timestamp } from "firebase/firestore";
import PersonalInfoApply from "../components/PersonalInfoApply";
import Password from "antd/es/input/Password";

const UserRegister = () => {
  const [applyState, setApplyState] = useState({
    uniqueValue: false,
    uniqueAt: undefined,
    personalValue: false,
    personalAt: undefined,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const registerRef = useRef();
  const handleApplys = (value) => {
    setApplyState(() => ({ ...applyState, ...value }));
  };

  const registerFinished = (value) => {
    console.log(value);
  };

  const backgroudUrl =
    "https://firebasestorage.googleapis.com/v0/b/preed-manager.appspot.com/o/assets%2F5291450.jpg?alt=media&token=a1a60ba2-4ca8-4baa-b249-6b28160592ae";

  const step1Component = (
    <div className="flex flex-col w-full bg-white">
      <div className="flex w-full flex-wrap">
        <div className="flex w-full flex-col p-4 h-auto ">
          <span>고유식별정보 처리동의</span>
          <div className="flex w-full h-full justify-start items-center border">
            <UniqueIdApply />
          </div>
          <div className="flex h-auto justify-start items-center mt-4">
            <Radio.Group
              name="uniqueApply"
              defaultValue={false}
              onChange={(e) => {
                const today = new Date();
                const timestampToday = Timestamp.fromDate(today);
                handleApplys({
                  uniqueValue: e.target.value,
                  uniqueAt: timestampToday,
                });
              }}
            >
              <Radio value={true}>동의함</Radio>
              <Radio value={false}>동의안함</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className="flex w-full flex-col p-4 h-auto ">
          <span>개인정보를 위한 이용자 동의</span>
          <div className="flex w-full h-full justify-start items-center border">
            <PersonalInfoApply />
          </div>
          <div className="flex h-auto justify-start items-center  mt-4">
            <Radio.Group
              name="personalApply"
              defaultValue={false}
              onChange={(e) => {
                const today = new Date();
                const timestampToday = Timestamp.fromDate(today);
                handleApplys({
                  personalValue: e.target.value,
                  personalAt: timestampToday,
                });
              }}
            >
              <Radio value={true}>동의함</Radio>
              <Radio value={false}>동의안함</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
    </div>
  );

  const step2Component = (
    <div className="flex flex-col w-full bg-white">
      <div className="flex w-full justify-center h-20">
        <span
          className="text-gray-600"
          style={{ fontSize: "24px", fontWeight: "bold" }}
        >
          기본정보
        </span>
      </div>
      <div className="flex w-full justify-center">
        <Form
          ref={registerRef}
          onFinish={registerFinished}
          style={{ width: "80%" }}
        >
          <Form.Item name="userEmail">
            <div
              className="flex bg-gray-100 w-full items-center rounded-lg"
              style={{ maxWidth: "800px", height: "55px" }}
            >
              <div className="flex w-1/4 px-5 justify-end h-full items-center">
                <span className="font-semibold">이메일</span>
              </div>
              <div className="flex w-2/4 px-5 justify-start h-full items-center">
                <Input style={{ height: "70%", width: "350px" }} />
              </div>
            </div>
          </Form.Item>
          <Form.Item name="userPassword">
            <div
              className="flex bg-gray-100 w-full items-center rounded-lg"
              style={{ maxWidth: "800px", height: "55px" }}
            >
              <div className="flex w-1/4 px-5 justify-end h-full items-center">
                <span className="font-semibold">비밀번호</span>
              </div>
              <div className="flex w-2/4 px-5 justify-start h-full items-center">
                <Password style={{ height: "70%", width: "350px" }} />
              </div>
            </div>
          </Form.Item>
          <Form.Item name="userPasswordVerify">
            <div
              className="flex bg-gray-100 w-full items-center rounded-lg"
              style={{ maxWidth: "800px", height: "55px" }}
            >
              <div className="flex w-1/4 px-5 justify-end h-full items-center">
                <span className="font-semibold">비밀번호</span>
              </div>
              <div className="flex w-2/4 px-5 justify-start h-full items-center">
                <Password style={{ height: "70%", width: "350px" }} />
              </div>
            </div>
          </Form.Item>
          <Button htmlType="submit">회원가입</Button>
        </Form>
      </div>
    </div>
  );
  const stepItems = [
    {
      title: "약관동의",
      component: step1Component,
    },
    {
      title: "개인정보입력",
      component: step2Component,
    },
    {
      title: "가입완료",
    },
  ];

  return (
    <div
      className="w-screen h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${backgroudUrl})` }}
    >
      <div
        className="flex flex-col p-2 md:p-5 bg-white md:rounded-lg w-full h-full md:w-5/6 md:h-5/6 lg:w-2/3"
        style={{ maxWidth: "1000px", maxHeight: "1000px" }}
      >
        <div className="flex w-full py-5 px-10">
          <Steps items={stepItems} />
        </div>
        <div className="flex w-full p-5">
          {stepItems[currentStep - 1]?.component}
        </div>
        <div className="flex px-5 justify-center items-center">
          {currentStep === 1 && (
            <Button size="large" onClick={() => setCurrentStep(2)}>
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
