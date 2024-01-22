import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Upload,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";

import { useEffect } from "react";
import { generateFileName, generateUUID } from "../functions";
import { makerNames, productTypes } from "../consts";
import TextArea from "antd/es/input/TextArea";
import useImageUpload from "../hooks copy/useFireStorage";
import {
  useFirestoreAddData,
  useFirestoreQuery,
  useFirestoreUpdateData,
} from "../hooks/useFirestore";
import { useLocation } from "react-router-dom";
import { where } from "firebase/firestore";

const EditElectronicProduct = () => {
  const [thumbnailFileList, setThumbnailFile] = useState([]);
  const [descriptionFileList, setDescriptionFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [popConfirmOpen, setPopConfirmOpen] = useState({
    thumb: false,
    description: false,
  });

  const [targetDeleteFile, setTargetDeleteFile] = useState();
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const productRef = useRef();
  const uploadThumbnail = useImageUpload("/productPic/");
  const uploadDescription = useImageUpload("/productDescrition/");
  const productAdd = useFirestoreAddData();
  const productUpdate = useFirestoreUpdateData();
  const itemQuery = useFirestoreQuery();
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

  const handleThumbnailPopConfirm = (value) => {
    setTargetDeleteFile(value);
    setPopConfirmOpen({ ...popConfirmOpen, thumb: true });
  };

  const handleDescriptionPopConfirm = (value) => {
    setTargetDeleteFile(value);
    setPopConfirmOpen({ ...popConfirmOpen, description: true });
  };

  const handleThumbnailFileRemove = async (file) => {
    await uploadThumbnail.deleteFileFromStorage(file.url);

    const newFileList = thumbnailFileList.filter(
      (item) => item.uid !== file.uid
    );
    setThumbnailFile(newFileList);
    setPopConfirmOpen({ ...popConfirmOpen, thumb: false });
  };

  const handleDescriptionFileRemove = async (file) => {
    await uploadThumbnail.deleteFileFromStorage(file.url);

    const newFileList = descriptionFileList.filter(
      (item) => item.uid !== file.uid
    );
    setDescriptionFile(newFileList);
    setPopConfirmOpen({ ...popConfirmOpen, description: false });
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

  const handleInitProductForm = (ref, value) => {
    const initFormvalue = { ...value };
    delete initFormvalue.productThumbnail;
    delete initFormvalue.productDescription;
    delete initFormvalue.id;

    if (initFormvalue?.productUid) {
      ref?.current.setFieldsValue({ ...initFormvalue });
      setThumbnailFile([...value.productThumbnail]);
      setDescriptionFile([...value.productDescription]);
    }
  };

  const handleFinished = (value) => {
    const newValue = {
      ...value,
      productThumbnail: thumbnailFileList,
      productDescription: descriptionFileList,
    };
    //handleAddProduct(newValue);
    if (location?.state?.data.id) {
      handleUpdateProduct(location?.state?.data.id, { ...newValue });
    } else {
      openNotification(
        "error",
        "업데이트오류",
        "업데이트 대상의 id값 확인이 필요합니다.",
        "bottomLeft",
        3
      );
    }
  };

  const handleUpdateProduct = async (id, value) => {
    try {
      await productUpdate.updateData("electronics", id, { ...value }, () => {
        openNotification(
          "success",
          "데이터업데이트",
          "제품정보가 수정되었습니다.",
          "bottomLeft",
          3
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filterItemsIncludeProduct = async (id) => {
    let filteredItems = [];
    try {
      itemQuery.getDocuments("sangjos", (data) => {
        console.log(
          data.filter((item) =>
            item.productList.some((product) => product.id === id)
          )
        );

        filteredItems = data.filter((item) =>
          item.productList.some((product) => product.id === id)
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleInitProductForm(productRef);
  }, []);

  useEffect(() => {
    if (location?.state?.data) {
      handleInitProductForm(productRef, location.state.data);
      filterItemsIncludeProduct(location.state.data.id);
    }
  }, [location]);

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
          <Form.Item name="productThumbnail" label="대표사진">
            <Upload
              listType="picture-card"
              fileList={thumbnailFileList}
              onPreview={handlePreview}
              onRemove={handleThumbnailPopConfirm}
              customRequest={handleThumbnailUpload}
            >
              {thumbnailFileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Popconfirm
              title="파일삭제"
              description="파일을 삭제하시겠습니까?"
              onConfirm={() => handleThumbnailFileRemove(targetDeleteFile)}
              onCancel={() =>
                setPopConfirmOpen({ ...popConfirmOpen, thumb: false })
              }
              open={popConfirmOpen.thumb}
              okText="예"
              okType="default"
              cancelText="아니오"
            />
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
              onRemove={handleDescriptionPopConfirm}
              customRequest={handleDescriptionUpload}
            >
              <Button>업로드</Button>
            </Upload>
            <Popconfirm
              title="파일삭제"
              description="파일을 삭제하시겠습니까?"
              onConfirm={() => handleDescriptionFileRemove(targetDeleteFile)}
              onCancel={() =>
                setPopConfirmOpen({ ...popConfirmOpen, description: false })
              }
              open={popConfirmOpen.description}
              okText="예"
              okType="default"
              cancelText="아니오"
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button htmlType="submit">수정</Button>
          </div>
        </Form>
      </Card>
      {contextHolder}
    </div>
  );
};

export default EditElectronicProduct;
