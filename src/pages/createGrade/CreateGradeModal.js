import Modals from "../../components/common/Modal";
import CreateGrade from "./CreateGrade";

function CreateGradeModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Grade Master"}
        show={open === "createGrade" || open === "editingGradeData"}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateGrade />
      </Modals>
    </>
  );
}

export default CreateGradeModal;
