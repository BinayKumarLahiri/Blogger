import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { CiCalendarDate } from "react-icons/ci";
import { format } from "date-format-parse";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  return (
    <>
      <Link to={`/blog/${blog.category.slug}/${blog.slug}/${blog._id}`}>
        <Card className={"w-full h-fit"}>
          <CardHeader className={"py-0"}>
            <div className="w-full flex items-center justify-between">
              <div className="w-2/3 flex gap-2 items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={blog?.author?.avatar}
                    className="rounded-full"
                  />
                  <AvatarFallback>
                    {blog?.author?.name.toUpperCase().charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <p>{blog?.author?.name || "Unanimous"}</p>
              </div>
              {blog && blog.author && blog.author.role === "admin" && (
                <Badge variant={"outline"}>Admin</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full object-cover rounded-md mb-2"
            />
            <div className="flex items-center gap-2">
              <CiCalendarDate className="text-sm" />
              <span className="text-sm">
                {format(blog.createdAt, "DD-MM-YYYY")}
              </span>
            </div>
            <h2 className="text-lg line-clamp-2">{blog.title}</h2>
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default Blog;
