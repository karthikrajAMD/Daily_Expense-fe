import axios from "axios";
import React from "react";
import { useEffect, useContext } from "react";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { env } from "../env";
import Loading from "./Loading";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";
import Table from "react-bootstrap/Table";
import _ from "lodash";
import Sidebar from "./Sidebar";
import { Context } from "../Context";
import "jspdf-autotable";
import "../Table.css";
function DisplayRecords() {
  const [sideShow, setSideShow] = useContext(Context);
  const [dailyRecords, setDailyRecords] = useState();
  const [search, setSearch] = useState("");
  const [sorted, setSorted] = useState({ sorted: "date", reversed: false });
  const [dateSearch, setDateSearch] = useState("");
  const [lastDateSearch, setLastDateSearch] = useState("");
  const [paginatedData, setPaginatedData] = useState();
  const [change, setChange] = useState();
  const [items, setItems] = useState([]);

  let hitDateMatches;
  let pageSize = 3;
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
      setPaginatedData(_(searchResult()).slice(0).take(pageSize).value());
    } else {
      console.log(res.data.message);
    }
  };
  useEffect(() => {
    loadData();
  }, [search]);
  let pageCount = dailyRecords ? Math.ceil(dailyRecords.length / pageSize) : 0;
  useEffect(() => {}, [dateSearch, lastDateSearch]);
  const columns = [
    { title: "Date", field: "date" },
    { title: "Day", field: "day" },
    { title: "Month", field: "month" },
    { title: "Food Name", field: "foodName" },
    { title: "Place Name", field: "placeName" },
    { title: "Quantity", field: "quantity", type: "numeric" },
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
  // const [ac, setAct] = useState("active");
  const sortByDate = () => {
    const sortData = [...dailyRecords];
    sortData.sort((date1, date2) => {
      if (sorted.reversed) {
        return date1.date.localeCompare(date2.date);
      }
      return date2.date.localeCompare(date1.date);
    });

    handlePageClick({ selected: pageCount - 1 });
    setDailyRecords(sortData);
    setSorted({ sorted: "date", reversed: !sorted.reversed });
    setChange(true);
  };

  const renderArrow = () => {
    if (sorted.reversed) {
      return <ArrowUpwardIcon fontSize="large" />;
    }
    return <ArrowDownwardIcon fontSize="large" />;
  };
  const handlePageClick = async (data) => {
    console.log(data);
    let currentPage = data.selected + 1;
    let startIndex = (currentPage - 1) * 3;
    // console.log(startIndex);
    let pageData = _(dailyRecords).slice(startIndex).take(pageSize).value();
    setPaginatedData(pageData);
  };
  return (
    <>
      <main className={sideShow ? "space-toggle" : null}>
        <Sidebar />
        <div className="cont">
          <div>
            <div>
              <h5 className="my-search">
                Search by <span className="food">Food name</span> ,
                <span className="place">Place name</span> ,
                <span className="month">Month</span>.
              </h5>
              <input
                type="text"
                placeholder=" search...."
                onChange={(e) => setSearch(e.target.value)}
                className="mb-3 mt-3 p-1"
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
            {paginatedData ? (
              <Table responsive>
                <tr>
                  <th
                    onClick={() => {
                      sortByDate();
                    }}
                  >
                    <span style={{ marginRight: 10 }}>Date</span>
                    {sorted.sorted === "date" ? renderArrow() : null}
                  </th>
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
                {paginatedData.map((n, i) => (
                  <tr key={i}>
                    <td>{n.date}</td>
                    <td>{n.day}</td>
                    <td>{n.month}</td>
                    <td>
                      {n.expenseTime} {n.timeModulation}
                    </td>
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
              </Table>
            ) : (
              <Loading />
            )}
          </div>
          {paginatedData ? (
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          ) : (
            ""
          )}
        </div>
      </main>
    </>
  );
}

export default DisplayRecords;
