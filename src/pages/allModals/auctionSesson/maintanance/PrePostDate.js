import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosMain from "../../../../http/axios/axios_main";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const PrePostDate = ({ dateAndTime }) => {
  const initialValues = {
    date: dateAndTime?.saleDate.split("T")[0], // Assuming dateAndTime is an object with a 'date' property
    startTime: dateAndTime?.startDate.split("T")[1],
    endTime: dateAndTime?.enddate.split("T")[1], // Change the default end time as needed
  };

  const validationSchema = Yup.object({
    date: Yup.date().required("Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string()
      .required("End Time is required")
      .when("startTime", (startTime, schema) => {
        return schema.test(
          "is-after-start",
          "End Time must be after Start Time",
          function (endTime) {
            if (startTime && endTime) {
              return (
                new Date(`2000-01-01 ${endTime}`) >
                new Date(`2000-01-01 ${startTime}`)
              );
            }
            return true;
          }
        );
      }),
  });

  const onSubmit = (values) => {
    // Handle form submission here
    let data = {
      auctionSessionDetailId: dateAndTime.auctionSessionDetailId,
      saleDate: "2023-07-25T17:16:40",
      startDate: "2023-07-25T18:31:00",
      enddate: "2023-07-25T19:00:00",
      updatedBy: dateAndTime.auctionSessionDetailId,
    };

    // axiosMain
    //   .post(
    //     "preauction/AuctionSession/PrePostponeAuctionSessionResponse",
    //     values
    //   )
    //   .then((response) => {
    //     // Handle the successful response
    //     toast.success(response.data.massage);
    //   })
    //   .catch((error) => {
    //     // Handle any errors that occur during the request
    //     toast.error(error.message);
    //   });
    console.log("Form submitted with values:", values, dateAndTime);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  //   useEffect(() => {

  //   }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col-md-4 datetimepicker">
          <label>Sale Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.date && formik.errors.date ? "invalid" : ""
            }
          />
          {formik.touched.date && formik.errors.date && (
            <div className="error-message text-danger ">
              {formik.errors.date}
            </div>
          )}
        </div>
        <div className="col-md-4 datetimepicker">
          <label>Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formik.values.startTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.startTime && formik.errors.startTime
                ? "invalid"
                : ""
            }
          />
          {formik.touched.startTime && formik.errors.startTime && (
            <div className="error-message text-danger">
              {formik.errors.startTime}
            </div>
          )}
        </div>
        <div className="col-md-4 datetimepicker">
          <label>End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formik.values.endTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.endTime && formik.errors.endTime ? "invalid" : ""
            }
          />
          {formik.touched.endTime && formik.errors.endTime && (
            <div className="error-message text-danger">
              {formik.errors.endTime}
            </div>
          )}
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PrePostDate;
