import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { GoHome } from "react-icons/go";
import { TbCategory2 } from "react-icons/tb";
import { GrBlog } from "react-icons/gr";
import { BiComment } from "react-icons/bi";
import { LuSquareUserRound } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import axios from "axios";
import { useSelector } from "react-redux";
import Search from "./Search";

const AppSidebar = () => {
  const user = useSelector((state) => state.user);
  const [categoryies, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/category/getall`
      );
      if (response.status === 200) {
        //console.log(response.data.categories);
        setCategories([...response.data.categories]);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const isAuthorized = () => {
    return user && user.loggedIn && user.user.role === "admin";
  };
  return (
    <>
      <Sidebar>
        <SidebarHeader className={"bg-white"}>
          <img src={logo} alt="Logo" width={"30%"} />
        </SidebarHeader>
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarMenu>
              <Search style="w-[90%] m-auto md:hidden"></Search>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <GoHome />
                  <Link to="/">Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isAuthorized() && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <TbCategory2 />
                      <Link to="/categories">Categories</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BiComment />
                      <Link to="/comments">Comments</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LuSquareUserRound />
                      <Link to="/users">User</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {user && user.loggedIn && (
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <GrBlog />
                    <Link to="/blogs">Blogs</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarMenu>
              {categoryies &&
                categoryies.length > 0 &&
                categoryies.map((value) => (
                  <SidebarMenuItem key={value._id}>
                    <SidebarMenuButton>
                      <GoDot />
                      <Link to={`/filter/${value.slug}`}>{value.category}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </>
  );
};

export default AppSidebar;
