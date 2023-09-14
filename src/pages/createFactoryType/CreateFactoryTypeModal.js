import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import CreateFactoryType from "./CreateFactoryType";

function CreateFactoryTypeModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Factory Type"}
        show={open === "createFactoryType" || open === "editingFactoryTypeData"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateFactoryType />
      </Modals>
    </>
  );
}

export default CreateFactoryTypeModal;
