import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { env } from "../env";
import axios from "axios";
import Button from "react-bootstrap/Button";
function AddData() {
  const formik = useFormik({
    initialValues: {
      date: "",
      time: "",
      timeModulation: "",
      day: "",
      month: "",
      foodName: "",
      placeName: "",
      quantity: "",
      price: "",
      totalPrice: "",
    },
    validationSchema: Yup.object({
      date: Yup.date().required("Enter the expense made on date"),
      time: Yup.string().required("Enter approx time on your expense"),
      timeModulation: Yup.string(),
      day: Yup.string(),
      month: Yup.string(),
      foodName: Yup.string().required("Enter your expense on "),
      placeName: Yup.string().required("Enter the place"),
      quantity: Yup.number().required("Enter quantity"),
      price: Yup.number().required("Enter price for single quantity"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const submit = async (values) => {
    let res = await axios.post(`${env.apiurl}/dailyrecord`, {
      date: formik.values.date,
      day: formik.values.day,
      month: formik.values.month,
      expenseTime: formik.values.time,
      timeModulation: formik.values.timeModulation,
      foodName: formik.values.foodName,
      placeName: formik.values.placeName,
      quantity: formik.values.quantity,
      price: formik.values.price,
      totalPrice: formik.values.quantity * formik.values.price,
    });
  };
  // formik.values.totalPrice=formik.values.quantity*formik.values.price;
  const time = new Date(formik.values.time);
  console.log(time);
  console.log(
    time.toTimeString({
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  );
  console.log(formik.values.time);
  formik.values.time.slice(0, 2) >= 12
    ? (formik.values.timeModulation = "PM")
    : (formik.values.timeModulation = "AM");
  const date = new Date(formik.values.date);
  if (formik.values.date) {
    if (date.getDay() === 1) formik.values.day = "Monday";
    else if (date.getDay() === 2) formik.values.day = "Tuesday";
    else if (date.getDay() === 3) formik.values.day = "Wednesday";
    else if (date.getDay() === 4) formik.values.day = "Thursday";
    else if (date.getDay() === 5) formik.values.day = "Friday";
    else if (date.getDay() === 6) formik.values.day = "Saturday";
    else if (date.getDay() === 0) formik.values.day = "Sunday";
  }
  if (formik.values.date) {
    if (date.getMonth() === 0) formik.values.month = "January";
    else if (date.getMonth() === 1) formik.values.month = "February";
    else if (date.getMonth() === 2) formik.values.month = "March";
    else if (date.getMonth() === 3) formik.values.month = "April";
    else if (date.getMonth() === 4) formik.values.month = "May";
    else if (date.getMonth() === 5) formik.values.month = "June";
    else if (date.getMonth() === 6) formik.values.month = "July";
    else if (date.getMonth() === 7) formik.values.month = "August";
    else if (date.getMonth() === 8) formik.values.month = "September";
    else if (date.getMonth() === 9) formik.values.month = "October";
    else if (date.getMonth() === 10) formik.values.month = "November";
    else if (date.getMonth() === 11) formik.values.month = "December";
  }
  return (
    <>
      <div className="my-add-form">
        <div className="add-form">
          <h1 className="record-heading">Daily Expense</h1>
          <form onSubmit={formik.handleSubmit} className="MyForm">
            <label htmlFor="date">Expense made on date</label>
            <input
              id="date"
              name="date"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
            />
            {formik.touched.date && formik.errors.date ? (
              <div className="formik-error">{formik.errors.date}</div>
            ) : null}
            <label htmlFor="time">Time</label>
            <input
              id="time"
              name="time"
              type="time"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.time}
            />
            {formik.touched.time && formik.errors.time ? (
              <div className="formik-error">{formik.errors.time}</div>
            ) : null}
            <label htmlFor="day">Day</label>
            <input
              id="day"
              name="day"
              type="text"
              readOnly={true}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue={formik.values.day}
            />
            {formik.touched.day && formik.errors.day ? (
              <div className="formik-error">{formik.errors.day}</div>
            ) : null}
            <label htmlFor="foodName">Expense made on</label>
            <input
              id="foodName"
              name="foodName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.foodName.toLowerCase()}
            />
            {formik.touched.foodName && formik.errors.foodName ? (
              <div className="formik-error">{formik.errors.foodName}</div>
            ) : null}

            <label htmlFor="placeName">Location</label>
            <input
              id="placeName"
              name="placeName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.placeName}
            />
            {formik.touched.placeName && formik.errors.placeName ? (
              <div className="formik-error">{formik.errors.placeName}</div>
            ) : null}

            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.quantity}
            />
            {formik.touched.quantity && formik.errors.quantity ? (
              <div className="formik-error">{formik.errors.quantity}</div>
            ) : null}
            <label htmlFor="price">Price per qty</label>
            <input
              id="price"
              name="price"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="formik-error">{formik.errors.price}</div>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              className="submit-button"
              onClick={() => {
                submit();
              }}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddData;
