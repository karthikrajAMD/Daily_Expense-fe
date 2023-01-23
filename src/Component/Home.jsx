import React, { useContext } from "react";
import AddData from "./AddData";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../Context";
function Home() {
  const [sideShow, setSideShow] = useContext(Context);
  console.log(sideShow);
  return (
    <main className={sideShow ? "space-toggle" : null}>
      <Sidebar />
      <AddData />
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
    </main>
  );
}

export default Home;
