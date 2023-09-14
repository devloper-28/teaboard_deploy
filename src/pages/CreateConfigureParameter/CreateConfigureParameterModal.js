import Modals from "../../components/common/Modal";
import CreateConfigureParameter from "./CreateConfigureParameter";

function CreateConfigureParameterModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Configure Parameter"}
        show={open === "CreateConfigureParameter" ? true : false}
        handleClose={() => setOpen("")}
        size="xl"
      >
        <CreateConfigureParameter />
      </Modals>
    </>
  );
}

export default CreateConfigureParameterModal;
