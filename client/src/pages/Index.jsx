import Blog from "@/components/Blog";
import Loader from "@/components/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
axios.defaults.withCredentials = true;

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blog/showAll`,
        {
          withCredentials: true,
        }
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
  if (loading) return <Loader />;
  return (
    <div className="w-full h-full p-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      {blogs &&
        blogs.length > 0 &&
        blogs.map((blog) => {
          return <Blog blog={blog} key={blog._id}></Blog>;
        })}
    </div>
  );
};

export default Index;
