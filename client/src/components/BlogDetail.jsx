import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CiCalendarDate } from "react-icons/ci";
import { format } from "date-format-parse";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegCommentAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { decode } from "entities";
import Comments from "./Comments";

const BlogDetail = ({ blog }) => {
  // //console.log(blog);
  const user = useSelector((state) => state.user);
  //console.log(user.loggedIn);
  return (
    <>
      <Card className={"col-span-2 w-full mx-auto"}>
        <CardHeader>
          <h1 className="text-xl font-semibold mb-2">{blog.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={blog?.author?.avatar} />
                <AvatarFallback>
                  {blog?.author?.name.toUpperCase().charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{blog?.author?.name || "Unanimous"}</p>
                <div className="flex items-center gap-2">
                  <CiCalendarDate className="text-lg" />
                  <span className="text-sm">
                    {format(blog.createdAt, "DD-MM-YYYY")}
                  </span>
                </div>
              </div>
            </div>
            {user.loggedIn && (
              <div className="flex gap-5">
                <FaRegHeart />
                <FaRegCommentAlt />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full rounded-md mb-2"
          />
          <div
            className="mt-5"
            dangerouslySetInnerHTML={{
              __html: decode(blog.content) || "",
            }}></div>
        </CardContent>
        <CardFooter>
          <Comments></Comments>
        </CardFooter>
      </Card>
    </>
  );
};

export default BlogDetail;
