import React from "react";

const UniqueIdApply = () => {
  return (
    <div className="flex h-full " style={{ maxWidth: "1000px", width: "100%" }}>
      <span
        className="w-full border-gray-200 p-4 text-gray-700 overflow-y-auto"
        style={{
          border: "1px solid #e9e9e9",
          fontFamily: "Noto Sans KR",
          fontSize: "12px",
          maxHeight: "70px",
        }}
      >
        고객님의 고유식별정보 (아이핀, 연락처, 이메일)를
        처리(수집,이용,제공,조회등)하기 위해서는 「개인정보보호법」제24조에
        의하여 동의를 얻어야 합니다. 여기서 제공해주시는 고유식별정보는 요청하신
        서비스를 제공하는 목적에 부합하는 용도로만 사용됩니다.
      </span>
    </div>
  );
};

export default UniqueIdApply;
