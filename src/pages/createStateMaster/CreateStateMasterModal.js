import React from "react";
import Modals from "../../components/common/Modal";
import CreateStateMaster from "./CreateStateMaster";

function CreateStateMasterModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"State Master"}
        show={open === "createStateMaster" || open === "editingStateData"}
        size="xl"
        handleClose={() => setOpen("")}
      >
        <CreateStateMaster />
      </Modals>
    </>
  );
}

export default CreateStateMasterModal;
