import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TableComponent from "../tableComponent/TableComponent";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchAuctionCenter } from "../../store/actions";
import NoData from "../nodata/NoData";

const CenterCard = () => {
  const auctionCenter = useSelector(
    (state) => state.auction.auctionCenter.responseData
  );

  const dispatch = useDispatch();

  const activeClass = useSelector((state) => state.toggle.activeClass);

  const navigate = useNavigate();

  const [columns] = useState([
    { name: "Auctioneer" },
    { name: "Session Period" },
    { name: "Session Status" },
    { name: "Session Type" },
  ]);

  const [rows] = useState([
    {
      Auctioneer: "John Doe",
      "Session Period": "2023-07-01",
      "Session Status": "Active",
      "Session Type": "Public",
    },
    {
      Auctioneer: "Jane Smith",
      "Session Period": "2023-07-05",
      "Session Status": "Inactive",
      "Session Type": "Private",
    },
  ]);
  // const [tableColumnExtensions] = useState([
  //   { columnName: "Auctioneer" },
  //   { columnName: "Session Period" },
  //   { columnName: "Session Status" },
  //   { columnName: "Session Type" },
  // ]);
  useEffect(() => {
    dispatch(fetchAuctionCenter()); // Dispatch the action to fetch auction center data
  }, []);
  // iformfile
  return (
    <>
      <div className={`${activeClass && "active"}  MainComponent `}>
        <div className="TeaboardDashboard">
          <div className="container-fluid">
            <div className="row">
              {auctionCenter &&
                auctionCenter?.map((e) => {
                  return (
                    <div
                      className="col-xl-4 col-lg-6 col-md-6 col-12 py-3 px-2"
                      key={e.auctionCenterId}
                    >
                      <div className="AuctionCenter">
                        <div className="TableTitle">
                          <h6 className="AuctionCenterName">
                            {e.auctionCenterName}
                          </h6>
                          <span>
                            <small className="SaleNo">
                              Sale No.: <span className="No">21</span>
                            </small>{" "}
                            <i className="fa-solid fa-calendar-days"></i> 2023
                          </span>
                        </div>
                        <div className="TableBox">
                          <TableComponent
                            columns={columns}
                            rows={rows}
                            // tableColumnExtensions={tableColumnExtensions}
                          />
                        </div>
                        <a
                          onClick={() => {
                            navigate("/auction");
                          }}
                          target="_blank"
                          className="ClickToEnter"
                        >
                          {" "}
                          Click here to enter{" "}
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CenterCard;
