import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidenav";
import Header from "./components/Header";

const HEADER_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 700);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true); // desktop always open
      } else {
        setIsOpen(false); // mobile default closed
      }
    };

    handleResize(); // run once on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* HEADER */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* SIDEBAR (BELOW HEADER) */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* BODY (ONLY THIS SCROLLS) */}
      <main
        style={{
          marginTop: HEADER_HEIGHT,
          marginLeft: isOpen ? SIDEBAR_WIDTH : 0,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          overflowY: "auto",
          transition: "margin-left 0.3s ease",
        }}
        className="bg-light p-4"
      >
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
