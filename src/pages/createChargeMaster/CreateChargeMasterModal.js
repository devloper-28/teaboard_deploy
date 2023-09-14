import Modals from "../../components/common/Modal";

import CreateChargeMaster from "./CreateChargeMaster";

function CreateChargeMasterModal({ open, setOpen }) {
  const handleClose = () => {
    setOpen("");
  };
  return (
    <>
      <Modals
        title={"Charge Master"}
        show={open === "createChargeMaster" || open === "editingChargeData"}
        handleClose={handleClose}
        size="xl"
      >
        <CreateChargeMaster />
      </Modals>
    </>
  );
}

export default CreateChargeMasterModal;
