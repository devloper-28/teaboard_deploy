import Modals from "../../components/common/Modal";
import RegisterUser from "./RegisterUser";


function RegisterUserModal({ open, setOpen }) {

  return (
    <>
      <Modals
        title={"Register User"}
        show={open === "registerUser"}
        handleClose={() => setOpen("")}
        size="md"
      >
        <RegisterUser/>
      </Modals>

    
    </>
  );
}

export default RegisterUserModal;
