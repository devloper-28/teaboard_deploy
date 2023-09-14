import Modals from "../../components/common/Modal";
import CreateTaxMaster from "./createTaxMaster";

function CreateTaxMasterModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Tax Master"}
        handleClose={() => setOpen("")}
        show={open === "createTaxMaster" || open === "editingTaxData"}
        size="xl"
      >
        <CreateTaxMaster />
      </Modals>
    </>
  );
}

export default CreateTaxMasterModal;
