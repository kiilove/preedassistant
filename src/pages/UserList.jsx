import React, { useState } from "react";

const UserList = () => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading ? (
        <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg"></div>
      ) : (
        <div className="flex w-full h-full  rounded-lg flex-col gap-y-2">
          <div className="flex w-full bg-white justify-start items-center p-5 rounded-lg"></div>
          <div className="flex w-full h-auto bg-white rounded-lg p-2 gap-2"></div>
        </div>
      )}
    </>
  );
};

export default UserList;
