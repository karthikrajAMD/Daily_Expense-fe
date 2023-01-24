import React, { useContext } from "react";
import AddData from "./AddData";
import Sidebar from "./Sidebar";
import { Context } from "../Context";
function Home() {
  const [sideShow, setSideShow] = useContext(Context);
  console.log(sideShow);
  return (
    <main className={sideShow ? "space-toggle" : null}>
      <Sidebar />
      <AddData />
    </main>
  );
}

export default Home;
