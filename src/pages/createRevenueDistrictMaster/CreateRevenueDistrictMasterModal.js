import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import CreateRevenueDistrictMaster from "./CreateRevenueDistrictMaster";

function CreateRevenueDistrictMasterModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Revenue District Master"}
        show={
          open === "createRevenueDistrictMaster" ||
          open === "editingRevenueData"
        }
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateRevenueDistrictMaster />
      </Modals>
    </>
  );
}

export default CreateRevenueDistrictMasterModal;
