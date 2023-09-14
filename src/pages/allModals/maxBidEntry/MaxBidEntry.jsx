import React, { useState } from "react";
import Modal from "../../../components/common/Modal";

import MaxBidEntryModal from "./modal/MaxBidEntryModal";

function MaxBidEntry({ open, setOpen }) {
  const [dataList, setDataList] = useState(
    JSON.parse(localStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Max Bid Entry"
          show={open === "maxBidEntry" ? true : false}
          handleClose={() => setOpen("")}
        >
          <MaxBidEntryModal dataList={dataList} setDataList={setDataList} />
        </Modal>
      )}
    </div>
  );
}

export default MaxBidEntry;
