import React from "react";
import logo from "@/assets/logo.png";
import { Button } from "./ui/button";
import { PiSignInFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { FiSearch } from "react-icons/fi";
import Search from "./Search";
import { useSelector } from "react-redux";
import ProfileDrawer from "./ProfileDrawer";
import { SidebarTrigger } from "./ui/sidebar";

const TopBar = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <nav className="w-screen p-5 bg-white h-[4rem] fixed top-0 z-20 flex justify-between items-center border-b">
        <img src={logo} alt=".Blog" width={"110"} className="hidden md:block" />
        <Search style={"hidden md:block"} />
        <SidebarTrigger className={"md:hidden"}></SidebarTrigger>
        <div>
          {!user.loggedIn ? (
            <Button asChild>
              <Link to="/signin">
                <PiSignInFill />
                Sign In
              </Link>
            </Button>
          ) : (
            <ProfileDrawer />
          )}
        </div>
      </nav>
    </>
  );
};

export default TopBar;
