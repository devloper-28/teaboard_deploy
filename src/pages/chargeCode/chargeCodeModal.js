import Modals from "../../components/common/Modal";
import ChargeCode from "./chargeCode";

function ChargeCodeModal({ open, setOpen }) {

  return (
    <>
    <Modals
      title={"Charge Code"}
      show={open === "chargeCode" || open === "editingChargeCodeData"}
      handleClose={() => setOpen("")}
      size="xl"
    >
    <ChargeCode/>
    </Modals>
  
      </>
  );
}

export default ChargeCodeModal;
