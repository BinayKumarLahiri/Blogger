import Blog from "@/components/Blog";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import Loader from "@/components/Loader";
axios.defaults.withCredentials = true;

const Index = () => {
  const [loading, setLoading] = useState(false);
  // const { category } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const query = queryParams.get("query");
  const location = useLocation();
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blog/search?query=${query}`
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
  }, [location]);
  if (loading) return <Loader></Loader>;
  return (
    <div>
      <div className="w-full p-5 flex gap-2 items-center">
        <FaSearch className="text-lg" />
        <p className="text-xl">Search Result</p>
      </div>
      <div className="w-full h-full p-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {blogs && blogs.length > 0 ? (
          blogs.length > 0 &&
          blogs.map((blog) => {
            return <Blog blog={blog} key={blog._id}></Blog>;
          })
        ) : (
          <p className="w-full text-center text-2xl font-semibold">
            No Blogs Found
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;
