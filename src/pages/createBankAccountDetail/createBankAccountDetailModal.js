import Modals from "../../components/common/Modal";
import CreateBankAccountDetail from "./createBankAccountDetail";

function CreateBankAccountDetailModal({ open, setOpen }) {
  return (
    <>
      <Modals
        title={"Bank Account Detail"}
        handleClose={() => setOpen("")}
        show={open === "createBankAccountDetail" || open === "editingBankData"}
        size="xl"
      >
        <CreateBankAccountDetail />
      </Modals>
    </>
  );
}

export default CreateBankAccountDetailModal;
