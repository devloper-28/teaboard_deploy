import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import ModalForm from "./modal/Modal";

function SampleShortage({ open, setOpen }) {
  const [dataList, setDataList] = useState(
    JSON.parse(localStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Sample & Shortage"
          show={open === "sampleshortage" ? true : false}
          handleClose={() => setOpen("")}
        >
          <ModalForm dataList={dataList} setDataList={setDataList} />
        </Modal>
      )}
    </div>
  );
}

export default SampleShortage;
