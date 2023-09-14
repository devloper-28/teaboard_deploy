import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import GroupMasterModalForm from "./modal/GroupMasterModal";

function GroupMaster({ open, setOpen }) {
  const [dataList, setDataList] = useState(
    JSON.parse(localStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Group Master"
          show={open === "groupMaster" ? true : false}
          handleClose={() => setOpen("")}
        >
          <GroupMasterModalForm dataList={dataList} setDataList={setDataList} />
        </Modal>
      )}
    </div>
  );
}

export default GroupMaster;
