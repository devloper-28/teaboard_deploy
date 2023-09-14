import Modals from "../../components/common/Modal";
import CreateSubTeaType from "./CreateSubTeaType";

function CreateSubTeaTypeModal({ open, setOpen }) {
    const handleClose = () => {
        setOpen("");
      };

  return (
    <>
      <Modals
        title={"Sub TeaType Master"}
        show={open === "createSubTeaType" || open === "editingSubTeaTypeData"}
        handleClose={handleClose}
        size="xl"
      >
        <CreateSubTeaType/>
        </Modals>
    </>
  );
}

export default CreateSubTeaTypeModal;
