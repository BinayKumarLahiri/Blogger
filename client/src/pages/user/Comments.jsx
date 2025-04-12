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

const Comments = () => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/comment/getallcomment`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        //console.log(response.data.comments);
        setComments([...response.data.comments]);
      }
    } catch (err) {
      //console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (commentId) => {
    try {
      setLoading(true);
      //console.log(commentId);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/comment/remove/${commentId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        fetchComments();
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
      <CardHeader className={"text-lg font-semibold"}>
        All User Comments
      </CardHeader>
      <CardContent>
        {/* <ScrollArea className={"w-full h-[70vh]"}> */}
        <Table className={"w-full"}>
          <TableHeader className={"sticky top-0"}>
            <TableRow>
              <TableHead className={"max-w-1/5"}>User</TableHead>
              <TableHead className={"max-w-1/5"}>Title</TableHead>
              <TableHead className={"max-w-1/5"}>Comment</TableHead>
              <TableHead className={"max-w-1/5"}>Commented On</TableHead>
              <TableHead className={"max-w-1/5"}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={"5"}>No Blogs Found</TableCell>
              </TableRow>
            ) : (
              comments.map((value) => (
                <TableRow key={value._id}>
                  <TableCell>{value?.author?.name || "Unonimous"}</TableCell>
                  <TableCell>{value?.blog?.title}</TableCell>
                  <TableCell className={"line-clamp-1"}>
                    {value?.content}
                  </TableCell>
                  <TableCell>{format(value.createdAt, "DD-MM-YYYY")}</TableCell>
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

export default Comments;
