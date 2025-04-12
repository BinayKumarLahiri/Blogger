import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import { format } from "date-format-parse";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "@/components/Loader";

axios.defaults.withCredentials = true;

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/all-user`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        //console.log(response.data.users);
        setUsers([...response.data.users]);
      }
    } catch (err) {
      //console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryid) => {
    try {
      setLoading(true);
      //console.log(categoryid);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/user/delete/${categoryid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        fetchCategories();
        toast.success(response.data.message);
      }
    } catch (err) {
      //console.log(err);
      toast.error(err.response.data.message);
      // navigate("/categories");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader></Loader>;
  return (
    <Card className={"w-[95%] mx-auto overflow-auto"}>
      <CardHeader className={"text-xl font-semibold"}>All Users</CardHeader>
      <CardContent>
        {/* <ScrollArea className={"w-full h-[70vh]"}> */}
        <Table className={"w-full"}>
          <TableHeader className={"sticky top-0"}>
            <TableRow>
              <TableHead className={"w-1/6"}>Role</TableHead>
              <TableHead className={"w-1/6"}>Avatar</TableHead>
              <TableHead className={"w-1/6"}>Name</TableHead>
              <TableHead className={"w-1/6"}>Email</TableHead>
              <TableHead className={"w-1/6"}>Created On</TableHead>
              <TableHead className={"w-1/6"}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell>No User Found</TableCell>
              </TableRow>
            ) : (
              users.map((value) => (
                <TableRow key={value._id}>
                  <TableCell>
                    {value.role.charAt(0).toUpperCase() + value.role.slice(1)}
                  </TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={value.avatar} />
                      <AvatarFallback>
                        {value.name.toUpperCase().charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{value.name}</TableCell>
                  <TableCell>{value.email}</TableCell>
                  <TableCell>{format(value.created, "DD-MM-YYYY")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className={"cursor-pointer"}
                        onClick={() => handleDelete(value._id)}>
                        <MdDelete />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* </ScrollArea> */}
      </CardContent>
    </Card>
  );
};

export default Users;
