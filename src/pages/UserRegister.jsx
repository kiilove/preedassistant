import React, { useEffect, useRef, useState } from "react";
import UniqueIdApply from "../components/UniqueIdApply";
import { Button, Card, Form, Input, Radio, Space, Steps } from "antd";
import { Timestamp } from "firebase/firestore";
import PersonalInfoApply from "../components/PersonalInfoApply";
import Password from "antd/es/input/Password";
import {
  encryptData,
  formatPhoneNumber,
  handlePhoneNumber,
} from "../functions";
import useFirebaseAuth from "../hooks/useFireAuth";
import { useFirestoreAddData } from "../hooks/useFirestore";

const UserRegister = () => {
  const [applyState, setApplyState] = useState({
    uniqueValue: false,
    uniqueAt: undefined,
    personalValue: false,
    personalAt: undefined,
  });
  const [registerInfo, setRegisterInfo] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const loginRef = useRef();
  const personalRef = useRef();
  const extraRef = useRef();
  const emailSignUp = useFirebaseAuth();
  const userAdd = useFirestoreAddData();
  const handleApplys = (value) => {
    setApplyState(() => ({ ...applyState, ...value }));
  };

  const handleUserInfo = async (data, collectionName) => {
    try {
      await userAdd.addData(collectionName, data, (value) =>
        console.log(value)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const registerFinished = (value) => {
    console.log(value);
  };

  const handleResult = async () => {
    const applys = registerInfo.applys;
    const logins = registerInfo.logins;
    const personals = registerInfo.personals;
    const createdAt = Timestamp.now();

    const newResult = {
      ...applys,
      ...logins,
      userPassword: encryptData(
        logins.userPassword.trim(),
        process.env.REACT_APP_SECRET_KEY
      ),
      ...personals,
      createdAt,
    };
    delete newResult.userPasswordVerify;

    console.log(logins);
    try {
      await emailSignUp.signUpWithEmail(
        logins.userEmail,
        logins.userPassword,
        (value) =>
          handleUserInfo(
            {
              ...newResult,
              userAuthUid: value.user.uid,
              userGrade: "normal",
              userPic: "",
            },
            "users"
          )
      );
    } catch (error) {
      console.log(error);
    }
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
      <div className="flex w-full justify-center items-center">
        <Button
          onClick={() => {
            setRegisterInfo(() => ({ ...registerInfo, applys: applyState }));
            setCurrentStep(2);
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );

  const step2Component = (
    <div className="flex justify-center items-center w-full flex-col">
      <Card
        title={
          <span
            className="text-gray-600"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            로그인정보
          </span>
        }
      >
        <div className="flex w-full justify-center">
          <Form
            ref={loginRef}
            onFinish={registerFinished}
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 10,
            }}
            size="large"
            style={{ width: "540px" }}
          >
            <Form.Item name="userEmail" label="이메일" labelAlign="left">
              <Space.Compact>
                <Input style={{ width: "280px" }} />
                <Button>중복체크</Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item name="userPassword" label="비밀번호" labelAlign="left">
              <Password style={{ width: "280px" }} />
            </Form.Item>
            <Form.Item
              name="userPasswordVerify"
              label="비밀번호확인"
              labelAlign="left"
            >
              <Password style={{ width: "280px" }} />
            </Form.Item>
          </Form>
        </div>
      </Card>
      <div className="flex w-full justify-center items-center">
        <Button
          onClick={() => {
            setRegisterInfo(() => ({
              ...registerInfo,
              logins: loginRef?.current.getFieldsValue(),
            }));
            setCurrentStep(3);
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );

  const step3Component = (
    <div className="flex justify-center items-center w-full flex-col">
      <Card
        title={
          <span
            className="text-gray-600"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            개인정보
          </span>
        }
      >
        <div className="flex w-full justify-center">
          <Form
            ref={personalRef}
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 10,
            }}
            size="large"
            style={{ width: "540px" }}
          >
            <Form.Item name="userName" label="이름(실명)" labelAlign="left">
              <Input style={{ width: "280px" }} />
            </Form.Item>
            <Form.Item name="userPhoneNumber" label="연락처" labelAlign="left">
              <Input
                style={{ width: "280px" }}
                onChange={(e) =>
                  handlePhoneNumber(
                    personalRef,
                    "userPhoneNumber",
                    e.target.value
                  )
                }
              />
            </Form.Item>
            <Form.Item name="userGender" label="성별" labelAlign="left">
              <Radio.Group
                name="userGender"
                defaultValue={false}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
              >
                <Radio value="여자">여자</Radio>
                <Radio value="남자">남자</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </Card>
      <div className="flex w-full justify-center items-center">
        <Button
          onClick={() => {
            setRegisterInfo(() => ({
              ...registerInfo,
              personals: personalRef?.current.getFieldsValue(),
            }));
            setCurrentStep(4);
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );

  const step4Component = (
    <div className="w-full flex h-full flex-col">
      <div className="w-full h-full justify-center items-center">가입완료</div>
      <div className="flex w-full justify-center items-center">
        <Button onClick={() => handleResult()}>마침</Button>
      </div>
    </div>
  );
  const stepItems = [
    {
      title: "약관동의",
      component: step1Component,
    },
    {
      title: "로그인정보",
      component: step2Component,
    },
    {
      title: "개인정보",
      component: step3Component,
    },
    {
      title: "가입완료",
      component: step4Component,
    },
  ];

  useEffect(() => {
    console.log(userAdd.error);
  }, [userAdd.error]);

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
          <Steps items={stepItems} current={currentStep - 1} />
        </div>
        <div className="flex w-full p-5">
          {stepItems[currentStep - 1]?.component}
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
