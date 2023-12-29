export const productTypes = [
  { value: "TV", label: "TV" },
  { value: "사운드바", label: "사운드바" },
  { value: "냉장고", label: "냉장고" },
  { value: "김치냉장고", label: "김치냉장고" },
  { value: "냉동고", label: "냉동고" },
  { value: "세탁기", label: "세탁기" },
  { value: "건조기", label: "건조기" },
  { value: "에어컨", label: "에어컨" },
  { value: "제습기", label: "제습기" },
  { value: "스타일러", label: "스타일러" },
  { value: "청소기", label: "청소기" },
  { value: "식기세척기", label: "식기세척기" },
  { value: "공기청정기", label: "공기청정기" },
  { value: "안마의자", label: "안마의자" },
  { value: "돌침대", label: "돌침대" },
  { value: "돌쇼파", label: "돌쇼파" },
];

export const vendorList = [
  { value: "보람상조", label: "보람상조" },
  { value: "프리드라이프", label: "프리드라이프" },
];

export const sangjoList = [
  { value: "기본형", label: "기본형", refVendor: "보람상조" },
  { value: "고급형", label: "고급형", refVendor: "보람상조" },
  { value: "늘행복", label: "늘행복", refVendor: "프리드라이프" },
];

export const makerNames = [
  { value: "LG", label: "LG" },
  { value: "삼성", label: "삼성" },
  { value: "휴테크", label: "휴테크" },
  { value: "코지마", label: "코지마" },
  { value: "장수돌침대", label: "장수돌침대" },
];

export const accountCounts = [
  { value: "1구좌", label: "1구좌" },
  { value: "2구좌", label: "2구좌" },
  { value: "3구좌", label: "3구좌" },
  { value: "4구좌", label: "4구좌" },
];

export const quillModules = {
  toolbar: [
    ["link", "image", "video"],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
  ],
};

export const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "background",
  "color",
  "link",
  "image",
  "video",
  "width",
];
