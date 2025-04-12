import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TopBar from "@/components/TopBar";
import AppSidebar from "@/components/AppSidebar";
import Footer from "@/components/Footer";

const Layout = () => {
  return (
    <>
      <SidebarProvider>
        <TopBar></TopBar>
        <AppSidebar></AppSidebar>
        <main className="w-full">
          <div className="w-min-[80vw] h-[100%-20px] mt-15" id="container">
            <SidebarTrigger className={"hidden md:block"}></SidebarTrigger>
            <Outlet></Outlet>
            <Footer></Footer>
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default Layout;
