import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaleProgram from "../../pages/allModals/saleprogram/SaleProgram";
import Invoice from "../../pages/allModals/invoice/Invoice";
import CreateAuctionCenterModal from "../../pages/createAuctionCenter/CreateAuctionCenterModal";
import CreateStateMasterModal from "../../pages/createStateMaster/CreateStateMasterModal";
import Awr from "../../pages/allModals/awr/AWR";
import KutchCatalog from "../../pages/allModals/kutchacatalog/KutchaCatalog";
import LotNoSeries from "../../pages/allModals/lotnoseries/LotNoSeries";
import SampleShortage from "../../pages/allModals/sampleshortage/SampleShortage";
import AuctionSession from "../../pages/allModals/auctionSesson/AuctionSession";
import AuctionCatalog from "../../pages/allModals/auctioncatalog/AuctionCatalog";
import CreateCategoryModal from "../../pages/createCategory/CreateCategoryModal";
import CreateTeaTypeModal from "../../pages/createTeaType/CreateTeaTypeModal";
import CreateSubTeaTypeModal from "../../pages/createSubTeaType/CreateSubTeaTypeModal";
import CreatePlantationDistrictMasterModal from "../../pages/createPlantationDistrictMaster/CreatePlantationDistrictMasterModal";
import CreateRevenueDistrictMasterModal from "../../pages/createRevenueDistrictMaster/CreateRevenueDistrictMasterModal";
import CreateGradeModal from "../../pages/createGrade/CreateGradeModal";
import CreateFactoryTypeModal from "../../pages/createFactoryType/CreateFactoryTypeModal";
import CreateRoleModal from "../../pages/createRole/CreateRoleModal";
import ChargeCodeModal from "../../pages/chargeCode/chargeCodeModal";
import CreateBankAccountDetailModal from "../../pages/createBankAccountDetail/createBankAccountDetailModal";
import CreateTaxMasterModal from "../../pages/createTaxMaster/createTaxMasterModal";
import CreateSpuMasterDetailModal from "../../pages/createSpuMaster/createSpuMasterModal";
import CreateConfigureParameterModal from "../../pages/CreateConfigureParameter/CreateConfigureParameterModal";
import AuctioneerUserRegistrationModal from "../../pages/RegisterUser/RegisterUserModal";
import WarehouseUserRegistrationModal from "../../pages/RegisterUser/RegisterUserModal";
import RegisterUser from "../../pages/RegisterUser/RegisterUser";
import RegisterUserModal from "../../pages/RegisterUser/RegisterUserModal";
import WarehouseUserRegistration from "../../pages/RegisterUser/WarehouseUserRegistration/WarehouseUserRegistration";
import GroupMaster from "../../pages/allModals/groupMaster/GroupMaster";
import CreateChargeMasterModal from "../../pages/createChargeMaster/CreateChargeMasterModal";
import MaxBidEntry from "../../pages/allModals/maxBidEntry/MaxBidEntry";
import BusinessRule from "../../pages/allModals/businessRule/BusinessRule";
import PreAuctionStatusReport from "../../pages/allModals/preAuctionStatusReport/PreAuctionStatusReport";
import TeaQualityReport from "../../pages/allModals/teaQualityReport/TeaQualityReport";
// import PreAuctionStatusReport from "../../pages/allModals/preAuctionStatusReport/preAuctionStatusReport";

const AccordionItem = ({ title, content, onChange, expanded }) => {
  const [modalNames, setModalNames] = useState("");
  // const [expandedTab, setExpandedTab] = useState("Master");
  // const handleAccordionChange = (panel) => (_, isExpanded) => {
  //   setExpandedTab(isExpanded ? panel : null);
  //   // setDisable(false);
  //   // setIsEdit(false);
  //   console.log(panel === title);
  // };

  const handleItemClick = (ele) => {
    setModalNames(ele);
  };
  // updated in dharmik
  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography onClick={onChange(title)}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {Array.isArray(content) ? (
              <ul className="SideMenu">
                {content?.map((ele, index) => (
                  <li className="text-capitalize" key={index}>
                    <div onClick={() => handleItemClick(ele.name)}>
                      {ele.title}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <SaleProgram open={modalNames} setOpen={setModalNames} />
      <Invoice open={modalNames} setOpen={setModalNames} />
      <CreateStateMasterModal open={modalNames} setOpen={setModalNames} />
      <CreateAuctionCenterModal open={modalNames} setOpen={setModalNames} />
      <CreateCategoryModal open={modalNames} setOpen={setModalNames} />
      <CreateTeaTypeModal open={modalNames} setOpen={setModalNames} />
      <CreateSubTeaTypeModal open={modalNames} setOpen={setModalNames} />
      <CreatePlantationDistrictMasterModal
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateRevenueDistrictMasterModal
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateGradeModal open={modalNames} setOpen={setModalNames} />
      <CreateFactoryTypeModal open={modalNames} setOpen={setModalNames} />
      <CreateRoleModal open={modalNames} setOpen={setModalNames} />
      <CreateBankAccountDetailModal open={modalNames} setOpen={setModalNames} />
      <CreateTaxMasterModal open={modalNames} setOpen={setModalNames} />
      <CreateSpuMasterDetailModal open={modalNames} setOpen={setModalNames} />
      <Awr open={modalNames} setOpen={setModalNames} />
      <ChargeCodeModal open={modalNames} setOpen={setModalNames} />
      <SampleShortage open={modalNames} setOpen={setModalNames} />
      <KutchCatalog open={modalNames} setOpen={setModalNames} />
      <AuctionSession open={modalNames} setOpen={setModalNames} />
      <LotNoSeries open={modalNames} setOpen={setModalNames} />
      <AuctionCatalog open={modalNames} setOpen={setModalNames} />
      <GroupMaster open={modalNames} setOpen={setModalNames} />
      <CreateConfigureParameterModal
        open={modalNames}
        setOpen={setModalNames}
      />
      <RegisterUserModal open={modalNames} setOpen={setModalNames} />
      <WarehouseUserRegistration open={modalNames} setOpen={setModalNames} />
      <CreateChargeMasterModal open={modalNames} setOpen={setModalNames} />
      <MaxBidEntry open={modalNames} setOpen={setModalNames} />
      <BusinessRule open={modalNames} setOpen={setModalNames} />
      <PreAuctionStatusReport open={modalNames} setOpen={setModalNames} />
      <TeaQualityReport open={modalNames} setOpen={setModalNames} />
    </>
  );
};

export default AccordionItem;
