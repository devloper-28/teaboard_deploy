import React, { useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
import SaleModal from "./saleModal/SaleModal";

function SaleProgram({ open, setOpen }) {
  return (
    <div>
      {open && (
        <Modal
          title="Sale Program master"
          show={open === "saleProgramMaster" ? true : false}
          handleClose={() => setOpen("")}
          size="xl"
        >
          <SaleModal />
        </Modal>
      )}
    </div>
  );
}

export default SaleProgram;
