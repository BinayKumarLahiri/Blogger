import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const RelatedBlogs = () => {
  const { category } = useParams();
  const [blogData, setBlogData] = useState([]);
  const getBlog = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blog/getrelated/${category}`
      );
      if (response.status === 200) {
        //console.log(response.data.blogs);
        setBlogData([...response.data.blogs]);
        //console.log("UseState", blogData);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  useEffect(() => {
    getBlog();
  }, []);
  return (
    <>
      <Card className={"col-span-1 w-full h-fit"}>
        <CardHeader className={"text-xl font-semibold"}>
          Related Blogs
        </CardHeader>
        <CardContent>
          {blogData.length > 0 &&
            blogData.map((blog) => {
              //console.log(blog);
              return (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.category.slug}/${blog.slug}/${blog._id}`}
                  className="w-full flex gap-2 my-2 items-center">
                  <img
                    src={blog.thumbnail}
                    alt="Thumbnail"
                    className="w-12 h-8 rounded-sm"
                  />
                  <p className="font-semibold">{blog.title}</p>
                </Link>
              );
            })}
        </CardContent>
      </Card>
    </>
  );
};

export default RelatedBlogs;
