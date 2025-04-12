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
import Loader from "@/components/Loader";

axios.defaults.withCredentials = true;

const BlogList = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blog/getall`
      );
      if (response.status === 200) {
        //console.log(response.data.blogs);
        setBlogs([...response.data.blogs]);
      }
    } catch (err) {
      //console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogid) => {
    try {
      setLoading(true);
      //console.log(blogid);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/blog/remove/${blogid}`
      );
      if (response.status === 200) {
        fetchBlogs();
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
    <Card className={"w-[95%] mx-auto overscroll-auto"}>
      <CardHeader>
        <div>
          <Button asChild>
            <Link to={"/blog/create"}>
              <IoAdd className="text-white" />
              <p>Create Blog</p>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className={"overscroll-auto"}>
        {/* <ScrollArea className={"w-full h-[70vh] overscroll-auto"}> */}
        <Table className={"w-full"}>
          <TableHeader className={"sticky top-0"}>
            <TableRow>
              <TableHead className={"w-1/5"}>Thumbnail</TableHead>
              <TableHead className={"w-1/5"}>Title</TableHead>
              {/* <TableHead className={"w-1/5"}>Slug</TableHead> */}
              <TableHead className={"w-1/5"}>Category</TableHead>
              <TableHead className={"w-1/5"}>Created On</TableHead>
              <TableHead className={"w-1/5"}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={"5"}>No Blogs Found</TableCell>
              </TableRow>
            ) : (
              blogs.map((value) => (
                <TableRow key={value._id}>
                  <TableCell>
                    <img
                      src={value.thumbnail}
                      alt="thumbnail"
                      className="w-24 rounded-md"
                    />
                  </TableCell>
                  <TableCell>{value.title}</TableCell>
                  <TableCell>{value.category}</TableCell>
                  <TableCell>{format(value.createdAt, "DD-MM-YYYY")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" className={"cursor-pointer"}>
                        <Link to={`/blog/edit/${value._id}`}>
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

export default BlogList;
