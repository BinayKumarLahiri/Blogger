import BlogDetail from "@/components/BlogDetail";
import Loader from "@/components/Loader";
import RelatedBlogs from "@/components/RelatedBlogs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

axios.defaults.withCredentials = true;

const BlogView = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { blogId, category, blog } = useParams();
  const [blogData, setBlogData] = useState(null);
  const getBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blog/getblog/${blogId}`
      );
      if (response.status === 200) {
        //console.log(response.data.blog);
        setBlogData({ ...response.data.blog });
      }
    } catch (err) {
      //console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBlog();
  }, [location]);
  if (loading) return <Loader></Loader>;
  return (
    <div className="lg:grid lg:grid-cols-3 md:p-5 lg:gap-5">
      {blogData !== null && <BlogDetail blog={blogData}></BlogDetail>}
      <RelatedBlogs></RelatedBlogs>
    </div>
  );
};

export default BlogView;
