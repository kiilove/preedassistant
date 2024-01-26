import { Button, Card, Popconfirm, Table, Tooltip, notification } from "antd";
import React, { useContext, useState } from "react";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import {
  useFirestoreAddData,
  useFirestoreDeleteData,
  useFirestoreQuery,
  useFirestoreUpdateData,
} from "../hooks/useFirestore";
import { useEffect } from "react";
import { TitleBasicType } from "./ComponentTitles";
import { LoginContext } from "../context/LoginContext";
import { where } from "firebase/firestore";

const ItemTable = ({ data }) => {
  const navigate = useNavigate(null);
  const [popOpen, setPopOpen] = useState({ del: false });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bestItemByUserAction, setBestItemByUserAction] = useState({
    type: "",
    docuId: "",
    owner: "",
  });
  const [rowData, setRowData] = useState([]);
  const { currentUserInfo } = useContext(LoginContext);
  const bestItemAdd = useFirestoreAddData();
  const bestItemUpdate = useFirestoreUpdateData();
  const bestItemQuery = useFirestoreQuery();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };
  const columns = [
    { title: "상품명", dataIndex: "itemName", width: "45%" },
    {
      title: "상조상품",
      dataIndex: "itemSangjo",
      width: "10%",
      align: "center",
    },
    {
      title: "구좌수",
      dataIndex: "accountCount",
      width: "10%",
      align: "center",
    },
    { title: "판매사", dataIndex: "itemVendor", width: "10%", align: "center" },
    {
      title: "썸네일",
      dataIndex: "isThumbnail",
      width: "10%",
      align: "center",
    },
    {
      title: "상세페이지",
      dataIndex: "isDescription",
      width: "10%",
      align: "center",
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    columnWidth: "5%",
    onChange: onSelectChange,
  };

  const handleBestItemByAction = async (
    ownerToken,
    ownerGrade,
    action,
    values,
    id = null
  ) => {
    switch (action) {
      case "update":
        try {
          await bestItemUpdate.updateData("bestitems", id, {
            owner: ownerToken,
            ownerGrade: ownerGrade,
            bestItemIds: [...values],
            itemVendor: "프리드라이프",
          });
        } catch (error) {
          console.log(error);
        }
        break;
      case "add":
        try {
          await bestItemAdd.addData("bestitems", {
            owner: ownerToken,
            ownerGrade: ownerGrade,
            bestItemIds: [...values],
            itemVendor: "프리드라이프",
          });
        } catch (error) {
          console.log(error);
        }
      default:
        break;
    }
  };
  const fetchedBestItemByUserToken = async (userToken) => {
    // 이함수에서 기존 데이터가있는지 여부 체크하고
    // 있다면 update를 위한 데이터를 저장한다.
    // selectedRowKeys도 함께 세팅하는데 작동할지 여부는 테스트중
    if (!userToken) {
      return;
    }
    const tokenCondition = [
      where("owner", "==", userToken),
      where("itemVendor", "==", "프리드라이프"),
    ];
    try {
      await bestItemQuery.getDocuments(
        "bestitems",
        (data) => {
          console.log(data);
          if (data?.length > 0) {
            setSelectedRowKeys([...data[0].bestItemIds]);
            setBestItemByUserAction({
              type: "update",
              docuId: data[0].id,
              owner: userToken,
            });
          } else {
            setBestItemByUserAction({
              type: "add",
              docuId: "",
              owner: userToken,
            });
          }
        },
        tokenCondition
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleTableData = async (propData) => {
    let isBestArray = [];
    // 0.5초 대기
    // productInfo 비동기 문제로 별짓을 다해봐도 안되어서 0.5초간 강제 대기
    await new Promise((resolve) => setTimeout(resolve, 500));

    const tableData = propData.map((d, dIdx) => {
      const {
        id,
        accountCount,
        itemName,
        itemSangjo,
        itemVendor,
        isBest,
        productInfo,
      } = d;
      let isThumbnail = true;
      let isDescription = true;

      if (isBest) {
        isBestArray.push(id);
      }
      if (productInfo?.length > 0) {
        productInfo.forEach((info) => {
          if (info.productThumbnail.length > 0) {
            isThumbnail =
              isThumbnail &&
              info.productThumbnail.every((s) => s.url !== undefined);
          } else {
            isThumbnail = false;
          }

          if (info.productDescription.length > 0) {
            isDescription =
              isDescription &&
              info.productDescription.every((s) => s.url !== undefined);
          } else {
            isDescription = false;
          }
        });
      } else {
        isThumbnail = false;
        isDescription = false;
      }
      if (isThumbnail) {
        isThumbnail = (
          <div className="w-full flex justify-center items-center ">
            <IoCheckmarkCircleSharp className="text-green-500 text-2xl" />
          </div>
        );
      } else {
        isThumbnail = (
          <div className="w-full flex justify-center items-center ">
            <IoCloseCircleSharp className="text-red-500 text-2xl" />
          </div>
        );
      }

      if (isDescription) {
        isDescription = (
          <div className="w-full flex justify-center items-center ">
            <IoCheckmarkCircleSharp className="text-green-500 text-2xl" />
          </div>
        );
      } else {
        isDescription = (
          <div className="w-full flex justify-center items-center ">
            <IoCloseCircleSharp className="text-red-500 text-2xl" />
          </div>
        );
      }
      return {
        key: id,
        accountCount,
        itemName,
        itemSangjo,
        itemVendor,
        isThumbnail,
        isDescription,
      };
    });

    return tableData;
  };

  useEffect(() => {
    const processTableData = async () => {
      if (data?.length > 0) {
        const result = await handleTableData(data);
        setRowData([...result]);
      }
    };

    processTableData();
    if (currentUserInfo?.userAccessToken) {
      fetchedBestItemByUserToken(currentUserInfo.userAccessToken);
    }
  }, [data]);

  return (
    <div className="flex w-full h-full flex-wrap flex-col">
      <div className="flex w-full h-10 justify-between">
        <div className="flex w-1/2 h-full">
          {selectedRowKeys?.length > 0 ? (
            <span className="px-5 font-semibold">
              {selectedRowKeys.length}개 선택됨
            </span>
          ) : null}
        </div>
        <div className="flex">
          {currentUserInfo?.userGrade && selectedRowKeys?.length > 0 && (
            <Button
              onClick={() =>
                handleBestItemByAction(
                  bestItemByUserAction.owner,
                  currentUserInfo.userGrade,
                  bestItemByUserAction.type,
                  selectedRowKeys,
                  bestItemByUserAction.docuId
                )
              }
            >
              등록
            </Button>
          )}
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={rowData}
        className="w-full"
      />
    </div>
  );
};

export default ItemTable;
