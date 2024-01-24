import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
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
import DOMPurify from "dompurify";
import { useEffect } from "react";
import { generateFileName, generateUUID } from "../functions";
import {
  accountCounts,
  makerNames,
  productTypes,
  quillFormats,
  quillModules,
} from "../consts";
import TextArea from "antd/es/input/TextArea";
import useImageUpload from "../hooks copy/useFireStorage";
import { useFirestoreAddData } from "../hooks/useFirestore";

const NewElectronicProduct = () => {
  const [thumbnailFileList, setThumbnailFile] = useState([]);
  const [descriptionFileList, setDescriptionFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const productRef = useRef();
  const uploadThumbnail = useImageUpload("/productPic/");
  const uploadDescription = useImageUpload("/productDescrition/");
  const productAdd = useFirestoreAddData();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
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
        업로드
      </div>
    </div>
  );

  const handlePreview = async (file) => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleThumbnailFileAdd = (newFile) => {
    setThumbnailFile([...thumbnailFileList, newFile]);
  };

  const handleDescriptionFileAdd = (newFile) => {
    setDescriptionFile([...descriptionFileList, newFile]);
  };

  const handleThumbnailFileRemove = async (file) => {
    await uploadThumbnail.deleteFileFromStorage(file.url);

    const newFileList = thumbnailFileList.filter(
      (item) => item.uid !== file.uid
    );
    setThumbnailFile(newFileList);
  };
  const handleDescriptionFileRemove = async (file) => {
    await uploadDescription.deleteFileFromStorage(file.url);

    const newFileList = descriptionFileList.filter(
      (item) => item.uid !== file.uid
    );
    setThumbnailFile(newFileList);
  };

  const handleThumbnailUpload = async ({ file, onSuccess, onError }) => {
    const newFileName = generateFileName(file.name, generateUUID());

    try {
      const result = await uploadThumbnail.uploadImage(file, newFileName);
      handleThumbnailFileAdd({
        uid: result.filename,
        name: newFileName,
        url: result.downloadUrl,
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      onError(error);
    }
  };
  const handleDescriptionUpload = async ({ file, onSuccess, onError }) => {
    const newFileName = generateFileName(file.name, generateUUID());

    try {
      const result = await uploadDescription.uploadImage(file, newFileName);
      handleDescriptionFileAdd({
        uid: result.filename,
        name: newFileName,
        url: result.downloadUrl,
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      onError(error);
    }
  };

  const handleInitProductForm = (ref) => {
    ref?.current.resetFields();
    ref?.current.setFieldsValue({
      productUid: generateUUID(),
    });
    setThumbnailFile([]);
    setDescriptionFile([]);
  };

  const handleFinished = (value) => {
    const newValue = {
      ...value,
      productThumbnail: thumbnailFileList,
      productDescription: descriptionFileList,
    };
    handleAddProduct(newValue);
  };

  const handleAddProduct = async (value) => {
    try {
      await productAdd.addData("electronics", value, () => {
        handleInitProductForm(productRef);
        openNotification(
          "success",
          "데이터추가",
          "제품이 등록되었습니다.",
          "bottomLeft",
          3
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleInitProductForm(productRef);
  }, []);

  return (
    <div className="flex w-full h-full bg-white rounded-lg p-5">
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
      <Card title="가전제품등록" style={{ minWidth: "600px" }}>
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          ref={productRef}
          onFinish={handleFinished}
        >
          <Form.Item name="productUid" label="관리번호">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="productThumbnail"
            label="대표사진"
            rules={[
              { required: true, message: "대표사진 1장은 반드시 필요합니다." },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={thumbnailFileList}
              onPreview={handlePreview}
              onRemove={handleThumbnailFileRemove}
              customRequest={handleThumbnailUpload}
            >
              {thumbnailFileList.length >= 3 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item name="productType" label="상품종류">
            <Select allowClear options={[...productTypes]} />
          </Form.Item>
          <Form.Item name="productVendor" label="제조사">
            <Select allowClear options={[...makerNames]} />
          </Form.Item>
          <Form.Item name="productName" label="상품명">
            <Input />
          </Form.Item>
          <Form.Item name="productSpec" label="간략설명">
            <TextArea rows={3} style={{ resize: "none" }} />
          </Form.Item>
          <Form.Item name="productDescription" label="상세페이지" required>
            <Upload
              listType="picture"
              fileList={descriptionFileList}
              onPreview={handlePreview}
              onRemove={handleDescriptionFileRemove}
              customRequest={handleDescriptionUpload}
            >
              <Button>업로드</Button>
            </Upload>
          </Form.Item>
          <div className="flex">
            <Button htmlType="submit">상품등록</Button>
          </div>
        </Form>
      </Card>
      {contextHolder}
    </div>
  );
};

export default NewElectronicProduct;
