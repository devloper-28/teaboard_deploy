import Modals from "../../components/common/Modal";
import CreateRole from "./CreateRole";

function CreateRoleModal({ open, setOpen }) {

  return (
    <>
      <Modals
        title={"Role Master"}
        show={open === "createRole" || open === "editingRoleData"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateRole/>
      </Modals>

    
    </>
  );
}

export default CreateRoleModal;
