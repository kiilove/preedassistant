import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Upload,
  notification,
  theme,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import {
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { generateFileName, generateUUID, handleArrayEdit } from "../functions";
import {
  accountCounts,
  makerNames,
  productTypes,
  quillFormats,
  quillModules,
} from "../consts";
import TextArea from "antd/es/input/TextArea";
import useImageUpload from "../hooks copy/useFireStorage";
import {
  useFirestoreAddData,
  useFirestoreUpdateData,
} from "../hooks/useFirestore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductList from "./ProductList";

const EditProduct = () => {
  const location = useLocation(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const productModalRef = useRef(null);
  const [form] = Form.useForm();
  const {
    uploadImage,
    deleteFileFromStorage,
    uploadProgress,
    uploadResult,
    downloadUrl,
  } = useImageUpload("/productPic/");

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };

  const [newItemInfo, setNewItemInfo] = useState();
  const [currentItemInfo, setCurrentItemInfo] = useState({});
  const [productList, setProductList] = useState([]);
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [newProductInfo, setNewProductInfo] = useState({});
  const [currentProductInfo, setCurrentProductInfo] = useState({});

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [quillValue, setQuillValue] = useState("");
  const firestoreAdd = useFirestoreAddData();
  const firestoreUpdate = useFirestoreUpdateData();

  const handleQuillChange = (content, delta, source, editor) => {
    setQuillValue(editor.getContents());
  };

  const handleNewProductOpen = () => {
    const newProductUid = generateUUID();
    productModalRef.current?.setFieldsValue(() => {});
    setQuillValue(null);
    setNewProductInfo({ productUid: newProductUid });

    setNewProductOpen(true);
  };
  const handleNewProductClose = () => {
    setFileList([]);
    setNewProductOpen(false);
  };

  const handleDeleteConfirm = (propIndex) => {
    const newProductList = [...productList];
    newProductList.splice(propIndex, 1);
    setProductList([...newProductList]);
    console.log(newProductList);
    openNotification(
      "info",
      "상품삭제",
      "해당상품이 삭제되었습니다.",
      "bottomLeft",
      2
    );
  };
  const handleDeleteCancel = () => {
    return;
  };

  const handleEditProductOpen = (propIndex) => {
    // 선택한 상품 id값을 찾아와야함
    if (propIndex === undefined || propIndex === -1) {
      openNotification("error", "오류", "상품일련번호 불러오기 실패", "top", 2);
      return;
    } else {
      const productInfo = { ...productList[propIndex] };
      setCurrentProductInfo(() => ({ ...productInfo }));

      setFileList([...productInfo.productPic]);
      setQuillValue(JSON.parse(productInfo.productInfomation));

      setEditProductOpen(true);
    }
  };
  const handleEditProductClose = () => {
    setFileList([]);
    setEditProductOpen(false);
  };
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const onFinish = async (values) => {
    const newValue = { ...values, productList: [...productList] };
    const docuId = location.state.data.id;
    setCurrentItemInfo(() => ({ ...newValue }));

    if (!docuId && docuId === "") {
      openNotification(
        "error",
        "업데이트오류",
        "문서ID를 받아오지 못했습니다.",
        "bottomLeft",
        2
      );
    } else {
      try {
        await firestoreUpdate.updateData(
          "products",
          docuId,
          { ...newValue },
          () => {
            openNotification(
              "success",
              "업데이트",
              "업데이트를 완료했습니다.",
              "top",
              2
            );
          }
        );
      } catch (error) {
        openNotification("error", "topLeft", error.message);
      }
    }
  };
  const onProductFinish = async () => {
    setNewProductInfo(() => ({
      ...productModalRef.current?.getFieldsValue(),
      productUid: generateUUID(),
      productInfomation: JSON.stringify(quillValue),
      productPic: fileList,
    }));
    handleNewProductClose();
  };

  const onProductEditFinish = async () => {
    console.log(currentProductInfo);
    console.log(productList);
    const editProductInfo = {
      ...productModalRef.current?.getFieldsValue(),
      productInfomation: JSON.stringify(quillValue),
      productPic: fileList,
    };

    const newProductList = handleArrayEdit(
      productList,
      editProductInfo,
      "productUid",
      currentProductInfo?.productUid
    );
    console.log(newProductList);
    setProductList(() => [...newProductList]);
  };

  const reduceAddProductList = (data) => {
    if (!data?.productPic || !data?.productName) {
      return;
    }

    setProductList(() => [...productList, { ...data }]);
    setNewProductInfo({});
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const productPreview = () => {
    if (productList?.length === 0) {
      return (
        <Empty
          description={
            <span className="text-sm text-gray-400">제품을 추가해주세요</span>
          }
        />
      );
    } else if (productList.length > 0) {
      return (
        <div className="flex gap-2">
          {productList.map((product, pIdx) => {
            const {
              productPic,
              productName,
              productUid,
              makerName,
              productType,
              productInfomation,
            } = product;
            return (
              <Card
                className="w-full"
                cover={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center", // 수평 가운데 정렬
                      alignItems: "center", // 수직 가운데 정렬
                    }}
                  >
                    <img
                      src={productPic[0].url}
                      className="p-2"
                      style={{
                        maxWidth: "100px",
                      }}
                    />
                  </div>
                }
                style={{
                  maxWidth: "250px",
                }}
                actions={[
                  <EditOutlined
                    style={{ fontSize: "20px" }}
                    onClick={() => handleEditProductOpen(pIdx)}
                  />,
                  <Popconfirm
                    title="삭제"
                    description="해당 상품을 삭제하시겠습니까?"
                    onConfirm={() => handleDeleteConfirm(pIdx)}
                    onCancel={handleDeleteCancel}
                    okButtonProps={{
                      style: { backgroundColor: "red", width: "60px" },
                    }}
                    okText="예"
                    cancelText="아니오"
                  >
                    <DeleteOutlined style={{ fontSize: "20px" }} />
                  </Popconfirm>,
                ]}
              >
                <div className="flex flex-col" style={{ minHeight: "150px" }}>
                  <span className="flex text-sm font-semibold text-gray-600">
                    {makerName} {productName}
                  </span>
                  <div className="flex">
                    <ReactQuill
                      value={JSON.parse(productInfomation)}
                      theme="bubble"
                      readOnly
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      );
    }
  };
  const handleFileAdd = (newFile) => {
    setFileList([...fileList, newFile]);
  };

  const handelFileRemove = async (file) => {
    await deleteFileFromStorage(file.url);

    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    const newFileName = generateFileName(file.name, generateUUID());
    console.log(file);
    try {
      const result = await uploadImage(file, newFileName);
      console.log(result); // 업로드 결과를 출력

      // 업로드 성공 시 파일 정보를 업데이트하고 onSuccess 콜백 호출
      handleFileAdd({
        uid: result.filename, // 파일 고유 식별자로 업로드 결과의 filename 사용
        name: newFileName, // 파일 이름 유지
        url: result.downloadUrl, // 업로드 성공한 경우의 다운로드 URL
      });
      onSuccess();
    } catch (error) {
      console.error(error);

      // 업로드 실패 시 onError 콜백 호출
      onError(error);
    }
  };

  const productModalForm = (
    <Form
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 16,
      }}
      ref={productModalRef}
    >
      <Form.Item name="productPic" label="제품사진" required>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onRemove={handelFileRemove}
          customRequest={customRequest}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </Form.Item>
      <Form.Item name="productName" label="상품명">
        <Input />
      </Form.Item>
      <Form.Item name="productType" label="상품종류">
        <Select allowClear options={[...productTypes]} />
      </Form.Item>
      <Form.Item name="makerName" label="제조사">
        <Select allowClear options={[...makerNames]} />
      </Form.Item>
      <Form.Item
        name="productInfomation"
        label="상품설명"
        style={{ height: "auto", minHeight: "250px" }}
      >
        <div className="flex">
          <ReactQuill
            style={{
              height: "160px",
            }}
            theme="snow"
            modules={quillModules}
            formats={quillFormats}
            value={quillValue || ""}
            onChange={handleQuillChange}
          />
        </div>
      </Form.Item>
    </Form>
  );

  // const currentProductModalForm = (
  //   <Form
  //     labelCol={{
  //       span: 6,
  //     }}
  //     wrapperCol={{
  //       span: 16,
  //     }}
  //     ref={currentProductModalRef}
  //   >
  //     <Form.Item name="productPic" label="제품사진" required>
  //       <Upload
  //         listType="picture-card"
  //         fileList={fileList}
  //         onPreview={handlePreview}
  //         onRemove={handelFileRemove}
  //         customRequest={customRequest}
  //       >
  //         {fileList.length >= 8 ? null : uploadButton}
  //       </Upload>
  //     </Form.Item>
  //     <Form.Item name="productName" label="상품명">
  //       <Input />
  //     </Form.Item>
  //     <Form.Item name="productType" label="상품종류">
  //       <Select allowClear options={[...productTypes]} />
  //     </Form.Item>
  //     <Form.Item name="makerName" label="제조사">
  //       <Select allowClear options={[...makerNames]} />
  //     </Form.Item>
  //     <Form.Item
  //       name="productInfomation"
  //       label="상품설명"
  //       style={{ height: "auto", minHeight: "250px" }}
  //     >
  //       <div className="flex">
  //         <ReactQuill
  //           style={{
  //             height: "160px",
  //           }}
  //           theme="snow"
  //           modules={quillModules}
  //           formats={quillFormats}
  //           value={quillValue || ""}
  //           onChange={handleQuillChange}
  //         />
  //       </div>
  //     </Form.Item>
  //   </Form>
  // );

  useEffect(() => {
    if (!newProductInfo?.productUid) {
      return;
    }
    reduceAddProductList(newProductInfo);
  }, [newProductInfo]);

  useEffect(() => {
    if (!location.state) {
      return;
    }
    console.log(location.state.data);
    formRef.current?.setFieldsValue({
      ...location.state.data,
    });
    setProductList([...location.state.data.productList]);
  }, [location]);

  useEffect(() => {
    if (!currentProductInfo) {
      return;
    }

    productModalRef.current?.setFieldsValue({ ...currentProductInfo });
  }, [currentProductInfo]);

  useEffect(() => {
    console.log(productList);
  }, [productList]);

  return (
    <div className="flex w-full h-full bg-white rounded-lg p-5">
      <Card title="상품수정" style={{ minWidth: "600px" }}>
        <Form
          onFinish={onFinish}
          form={form}
          ref={formRef}
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
            <Switch checked={location?.state?.data?.itemIsActive} />
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
          <Card
            type="inner"
            title="제품구성"
            extra={
              <Button
                type="primary"
                className="bg-blue-600"
                onClick={() => handleNewProductOpen()}
              >
                제품추가
              </Button>
            }
          >
            {productPreview()}
          </Card>
          <Button htmlType="submit">저장</Button>
        </Form>
        <Modal
          title="제품정보"
          maskClosable={false}
          centered
          open={newProductOpen}
          onCancel={handleNewProductClose}
          onOk={onProductFinish}
          okText="추가"
          cancelText="취소"
          okButtonProps={{ style: { backgroundColor: "rgb(37,99,235)" } }}
        >
          {productModalForm}
        </Modal>
        <Modal
          title="제품정보수정"
          maskClosable={false}
          centered
          open={editProductOpen}
          onCancel={handleEditProductClose}
          onOk={onProductEditFinish}
          okText="수정"
          cancelText="취소"
          okButtonProps={{ style: { backgroundColor: "rgb(37,99,235)" } }}
        >
          {productModalForm}
        </Modal>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </Card>
      {contextHolder}
    </div>
  );
};

export default EditProduct;
