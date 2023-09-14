import Modals from "../../components/common/Modal";
import CreateTeaType from "./CreateTeaType";


function CreateTeaTypeModal({ open, setOpen }) {
    const handleClose = () => {
        setOpen("");
      };
  return (
    <>
      <Modals
        title={"Tea Type Master"}
        show={open === "createTeaType" || open === "editingTeaTypeData"}
        handleClose={handleClose}
        size="xl"
      >
       <CreateTeaType/>
      </Modals>
    </>
  );
}

export default CreateTeaTypeModal;
