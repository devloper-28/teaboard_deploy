import Modals from "../../components/common/Modal";
import CreatePlantationDistrictMaster from "./CreatePlantationDistrictMaster";

function CreatePlantationDistrictMasterModal({ open, setOpen }) {

  return (
    <>
      <Modals
        title={"Plantation District Master"}
        show={
          open === "createPlantationDistrictMaster" ||
          open === "editingPlantationData"
        }
        handleClose={() => setOpen("")}
        size="xl"
      >
       
       <CreatePlantationDistrictMaster/>
      </Modals>

     
    </>
  );
}

export default CreatePlantationDistrictMasterModal;
