import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-format-parse";
import { MdDelete } from "react-icons/md";

axios.defaults.withCredentials = true;

const formSchema = z.object({
  comment: z.string().trim().nonempty(),
});

const Comments = () => {
  const location = useLocation();
  const { blogId } = useParams();
  //console.log(blogId);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });
  const user = useSelector((state) => state.user);
  //console.log("Comment:", user);

  const [comments, setComments] = useState([]);
  const getComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/comment/getall/${blogId}`
      );
      if (response.status === 200) {
        //console.log(response.data.comments);
        setComments([...response.data.comments]);
        //console.log("Fetch Comment", comments);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  useEffect(() => {
    getComments();
  }, [location]);

  const handleDelete = async (commentId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/comment/remove/${commentId}`
      );
      if (response.status === 200) {
        //console.log(response.data.message);
        getComments();
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      //console.log(err);
    }
  };

  const onSubmit = async (values) => {
    //console.log(values);
    const data = {
      content: values.comment,
      blog: blogId,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/comment/add`,
        data
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        //console.log(response.data.comment);
        getComments();
      }
    } catch (err) {
      //console.log(err);
      toast.error(err.response.data.message);
    }
  };
  return (
    <div className="w-full">
      {user.loggedIn ? (
        <>
          <Form {...form} className="w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Input placeholder="Type Something" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </>
      ) : (
        <div className="w-full text-center">
          You need to be logged in to comment
        </div>
      )}
      <div className="w-full py-5">
        <Separator />
        {comments.length > 0 && (
          <p className="text-xl font-semibold m-2">
            {comments.length} Comments
          </p>
        )}
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => {
              return (
                <div key={comment._id} className="w-full py-2">
                  <div className="w-full flex items-center justify-between">
                    <div className="w-[80%] flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {comment.author.name.toUpperCase().charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-semibold">
                        {comment.author.name}
                      </p>
                      <p className="text-xs font-light">
                        {format(comment.createdAt, "DD-MM-YYYY")}
                      </p>
                    </div>
                    {comment.author._id === user.user.id && (
                      <Button
                        variant={"ghost"}
                        className={"cursor-pointer"}
                        onClick={() => handleDelete(comment._id)}>
                        <MdDelete />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm m-2">{comment.content}</p>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <p className="w-full text-center">No Comments</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;
