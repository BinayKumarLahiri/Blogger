import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Layout from "./layout/Layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AddCategory from "./pages/category/AddCategory";
import Categorydetails from "./pages/category/Categorydetails";
import EditCategory from "./pages/category/EditCategory";
import Editor from "./components/Editor";
import CreateBlog from "./pages/blog/CreateBlog";
import EditBlog from "./pages/blog/EditBlog";
import ViewBlog from "./pages/blog/ViewBlog";
import BlogList from "./pages/blog/BlogList";
import BlogView from "./pages/blog/BlogView";
import Users from "./pages/user/Users";
import Comments from "./pages/user/Comments";
import FilterBlogs from "./pages/blog/FilterBlogs";
import SearchedBlogs from "./pages/blog/SearchedBlogs";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Index></Index>}></Route>
            {/* Profile Routes */}
            <Route path="/profile" element={<Profile></Profile>}></Route>
            {/* Category Routes */}
            <Route path="/add-category" element={<AddCategory />}></Route>
            <Route path="/categories" element={<Categorydetails />}></Route>
            <Route
              path="/edit-category/:categoryid"
              element={<EditCategory />}></Route>
            <Route path="/editor" element={<Editor />}></Route>

            {/* Blog Routes */}

            <Route path="/blog/create" element={<CreateBlog />}></Route>
            <Route path="/blog/edit/:blogId" element={<EditBlog />}></Route>
            <Route path="/blog/view/:blogId" element={<ViewBlog />}></Route>
            <Route path="/blogs" element={<BlogList />}></Route>

            <Route
              path="/blog/:category/:blog/:blogId"
              element={<BlogView />}></Route>
            <Route path="/filter/:category" element={<FilterBlogs />}></Route>
            <Route path="/search" element={<SearchedBlogs />}></Route>

            <Route path="/users" element={<Users></Users>}></Route>
            <Route path="/comments" element={<Comments></Comments>}></Route>
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
