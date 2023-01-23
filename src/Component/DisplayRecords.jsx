import axios from "axios";
import React from "react";
import { useEffect, useContext } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { env } from "../env";
import Loading from "./Loading";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";
import Table from "react-bootstrap/Table";
import Sidebar from "./Sidebar";
import { Context } from "../Context";
import "jspdf-autotable";
import "../Table.css";
function DisplayRecords() {
  const [sideShow, setSideShow] = useContext(Context);
  const [dailyRecords, setDailyRecords] = useState("");
  const [search, setSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [lastDateSearch, setLastDateSearch] = useState("");
  let hitDateMatches;
  const loadData = async () => {
    let res = await axios.get(`${env.apiurl}/getRecords`);
    if (res.data.statusCode === 200) {
      const searchResult = () => {
        return res.data.MyRecords.filter(
          (n) =>
            n.foodName.includes(search) ||
            n.placeName.includes(search) ||
            n.month.toLowerCase().includes(search)
        );
      };
      setDailyRecords(searchResult());
    } else {
      console.log(res.data.message);
    }
  };
  useEffect(() => {
    loadData();
  }, [search]);
  useEffect(() => {}, [dateSearch, lastDateSearch]);
  const columns = [
    { title: "Date", field: "date" },
    { title: "Day", field: "day" },
    { title: "Month", field: "month" },
    { title: "Food Name", field: "foodName" },
    { title: "Place Name", field: "placeName" },
    { title: "Quantity", field: "quantity", type: "numneric" },
    { title: "Price per quantity", field: "price" },
    { title: "Total Price", field: "totalPrice" },
  ];
  const downloadPdf = () => {
    hitDateMatches = dailyRecords.filter((n) => {
      return n.date >= dateSearch && n.date <= lastDateSearch;
    });
    const sum = hitDateMatches.reduce((a, i) => a + i.totalPrice, 0);
    console.log(hitDateMatches);
    // hitDateMatches.push({ Total: sum });
    if (dateSearch <= lastDateSearch && dateSearch && lastDateSearch) {
      const doc = new jsPDF();
      doc.text("Daily Expense", 20, 10);
      doc.autoTable({
        theme: "grid",
        columns: columns.map((col) => ({ ...col, dataKey: col.field })),

        body: hitDateMatches,
      });
      doc.autoTable({
        body: [{ sum: "Total: Rs." + sum + ".00" }],
        rows: [{ header: "Total", dataKey: "sum" }],
      });
      doc.save("Daily Expense.pdf");
    } else {
      // console.log("Select date range to download");
      toast.success("Select date in range to download");
    }
  };
  return (
    <>
      <main className={sideShow ? "space-toggle" : null}>
        <Sidebar />
        <div className="cont">
          <div>
            <div>
              {/* <ColorSchemesExample /> */}
              <input
                type="text"
                placeholder="search.."
                onChange={(e) => setSearch(e.target.value)}
                className="mb-3 mt-3"
              />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <Button className="mb-2" onClick={() => downloadPdf()}>
                Download
              </Button>
              <div className="mb-2" style={{ display: "flex", gap: "10px" }}>
                <input
                  id="date"
                  name="dateField"
                  type="date"
                  onChange={(e) => {
                    setDateSearch(e.target.value);
                  }}
                />
                <input
                  id="date"
                  name="dateField"
                  type="date"
                  onChange={(e) => {
                    setLastDateSearch(e.target.value);
                  }}
                />
              </div>
            </div>
            {dailyRecords ? (
              <Table responsive>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Month</th>
                  <th>Time</th>
                  <th>Food Name</th>
                  <th>Place Name</th>
                  <th>Quantity</th>
                  <th>Price per Quantity</th>
                  <th>Total Price</th>
                </tr>
                {/* <tbody> */}
                {dailyRecords.map((n, i) => (
                  <tr key={i}>
                    <td>{n.date}</td>
                    <td>{n.day}</td>
                    <td>{n.month}</td>
                    <td>
                      {n.expenseTime} {n.timeModulation}
                    </td>
                    {/* <td></td> */}
                    <td>{n.foodName}</td>
                    <td>{n.placeName}</td>
                    <td>{n.quantity}</td>
                    <td>{n.price}</td>
                    <td>{n.totalPrice}</td>
                  </tr>
                ))}
                <tr className="Total-price">
                  <td colSpan={8} className="totalPrice-table">
                    Total
                  </td>
                  <td>
                    {dailyRecords.reduce(
                      (a, i) => parseInt(a) + parseInt(i.totalPrice),
                      0
                    )}
                  </td>
                </tr>
                {/* </tbody> */}
              </Table>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default DisplayRecords;
