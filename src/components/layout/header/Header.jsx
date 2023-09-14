import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ICON } from "../../../assets/images";
import { toggleAction, toggleActionSuccess } from "../../../store/actions";

const HeaderUI = () => {
  const activeClass = useSelector((state) => state.toggle.activeClass);
  const dispatch = useDispatch();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const options = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const indianTime = time.toLocaleString('en-IN', options);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric", second: "numeric" };
    const formattedTime = time.toLocaleTimeString("en-IN", options);
    return formattedTime;
  };

  const handleClick = () => {
    dispatch(toggleActionSuccess());
  };

  return (
    <header className={activeClass ? "active" : ""}>
      <nav className="navbar navbar-expand-lg">
        <span onClick={handleClick} className="SidebarToggle">
          <i className={activeClass ? "fa fa-times" : "fa fa-bars"}></i>
        </span>
        <div className="container-fluid">
          <div className="LogoTitle mx-3">
            <a className="navbar-brand" href="index.html">
              <img src={ICON} className="img-fluid Logo" alt="Logo" />
            </a>
            <h2>Bharat Auction</h2>
          </div>

          <div className="header-2">
            <span>
              <b>Season :</b> 2023
            </span>{" "}
            <span className="divider"></span>{" "}
            <span>
              <b>Sale No :</b> 25
            </span>{" "}
            <span className="divider"></span>{" "}
            <span>
              <b>Auction Date :</b> 03-07-2023
            </span>{" "}
            <span className="divider"></span>
            <span>
              <b>Current Session Time :</b> 15:44- 15:47
            </span>
            <span className="Timer">
              {" "}
              <i className="fa fa-clock" aria-hidden="true"></i> {indianTime}{" "}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderUI;
