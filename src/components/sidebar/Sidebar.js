import React, { useState } from "react";
import SidebarContant from "./sidebarcontent/SidebarContant";
import AccordionItem from "../accordian/AccordianItem";
import { useSelector } from "react-redux";
import { FILE_ICON } from "../../assets/images/index";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [expandedTab, setExpandedTab] = useState("Master");
  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    // setDisable(false);
    // setIsEdit(false);
  };
  const activeClass = useSelector((state) => state.toggle.activeClass);

  const contant = SidebarContant?.filter((ele) => ele.show == true);
  const navigate = useNavigate();
  return (
    <div>
      <div className={activeClass ? "active SideBar" : "SideBar "}>
        <div className="SideBar-logo">
          <img src={FILE_ICON} className="img-fluid Logo" />
          <h2 className="SideBar-title">Bharat Auction</h2>
        </div>
        {contant?.map((value, index) => (
          <AccordionItem
            key={index}
            title={value.title}
            expanded={expandedTab === value.title ? true : false}
            onChange={handleAccordionChange(value.title)}
            content={value.content}
          />
        ))}
        <button
          className="LogoutBtn"
          onClick={() => {
            localStorage.removeItem("User");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
