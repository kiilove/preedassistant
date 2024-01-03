import React from "react";

const PersonalInfoApply = () => {
  return (
    <div className="flex h-full " style={{ maxWidth: "1000px", width: "100%" }}>
      <span
        className="w-full border-gray-200 p-4 text-gray-700 overflow-y-auto"
        style={{
          border: "1px solid #e9e9e9",
          fontFamily: "Noto Sans KR",
          fontSize: "12px",
          maxHeight: "250px",
        }}
      >
        고객님께서 작성하여 주신 내용과 관련하여 성실하게 답변 및 안내를 드리기
        위해 필요한 최소한의 개인정보를 수집하고 있습니다. 따라서, 개인정보의
        수집 및 이용에 관하여 아래와 같이 고지하오니 충분히 읽어보신 후 동의하여
        주시기 바랍니다.
        <br />
        <br /> (1) 개인정보의 수집 및 이용목적 회사는 수집한 개인정보를 마케팅의
        목적으로 활용하지 않으며 다음의 목적만을 위해 활용합니다.
        <br /> ◎ 이메일 답변 관련 연락 및 안내 <br />◎ 상품 안내 및 가입 안내
        <br />
        <br />
        (2) 수집하는 개인정보 항목 회사는 상담, 불만처리, 서비스 신청 등을 위해
        아래와 같은 개인정보를 수집하고 있습니다. <br />◎ 수집항목 : 이름,
        이메일, 연락처, 주소, 주민등록번호, 쿠키, 접속 IP 정보 <br />◎ 개인정보
        수집방법 : 홈페이지, 문의사항 접수 <br />
        <br />
        (3) 개인정보의 보유 및 이용기간 회사는 수집한 개인정보를 서비스 목적
        달성시 폐기합니다.
      </span>
    </div>
  );
};

export default PersonalInfoApply;
