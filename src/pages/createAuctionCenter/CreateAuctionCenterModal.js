import React from "react";
import Modals from "../../components/common/Modal";
import CreateAuctionCenter from "./CreateAuctionCenter";

function CreateAuctionCenterModal({ open, setOpen }) {
  const handleClose = () => {
    setOpen("");
  };

  return (
    <>
      <Modals
        title={"Auction Center Master"}
        // show={open === "createAuctionCenter" ? true : false}
        show={
          open === "createAuctionCenter" || open === "editingAuctionCenterData"
        }
        handleClose={handleClose}
        size="xl"
      >
        <CreateAuctionCenter />
      </Modals>
    </>
  );
}

export default CreateAuctionCenterModal;
