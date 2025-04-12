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
import Loader from "@/components/Loader";

axios.defaults.withCredentials = true;

const Categorydetails = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/category/getall`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        //console.log(response.data.categories);
        setCategories([...response.data.categories]);
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
        `${import.meta.env.VITE_API_BASE_URL}/category/delete/${categoryid}`,
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
      navigate("/categories");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader></Loader>;
  return (
    <Card className={"w-[95%] mx-auto"}>
      <CardHeader>
        <div>
          <Button asChild>
            <Link to={"/add-category"}>
              <IoAdd className="text-white" />
              <p>Add Category</p>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* <ScrollArea className={"w-full h-[70vh] overflow-x-auto"}> */}
        <Table className={"w-full"}>
          <TableHeader className={"sticky top-0"}>
            <TableRow>
              <TableHead className={"w-2/5"}>Category</TableHead>
              <TableHead className={"w-2/5"}>Slug</TableHead>
              <TableHead className={"w-1/5"}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell>No Categories Found</TableCell>
              </TableRow>
            ) : (
              categories.map((value) => (
                <TableRow key={value._id}>
                  <TableCell>{value.category}</TableCell>
                  <TableCell>{value.slug}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" className={"cursor-pointer"}>
                        <Link to={`/edit-category/${value._id}`}>
                          <FiEdit />
                        </Link>
                      </Button>
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

export default Categorydetails;
