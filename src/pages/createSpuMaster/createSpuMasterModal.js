import Modals from "../../components/common/Modal";
import CreateSpuMasterDetail from "./createSpuMaster";

function CreateSpuMasterDetailModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Spu Master"}
        handleClose={() => setOpen("")}
        show={open === "createSpuMaster" || open === "editingSpuData"}
        size="xl"
      >
        <CreateSpuMasterDetail />
      </Modals>
    </>
  );
}

export default CreateSpuMasterDetailModal;
