import Modals from "../../components/common/Modal";
 
import CreateCategory from "./CreateCategory";

function CreateCategoryModal({ open, setOpen }) {
    const handleClose = () => {
        setOpen("");
      };
  return (
    <>
      <Modals
        title={"Category Master"}
        show={open === "createCategory" || open === "editingCategoryData"}
        handleClose={handleClose}
        size="xl"
      >
        <CreateCategory/>
        </Modals>
    </>
  );
}

export default CreateCategoryModal;
