import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import TextEditor from "react-simple-wysiwyg";
import Dropzone from "react-dropzone";
import { IoImage } from "react-icons/io5";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { decode } from "entities";
import Loader from "@/components/Loader";
axios.defaults.withCredentials = true;

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty()
    .min(5, "Title Must be atleat 5 characters Long"),
  slug: z
    .string()
    .trim()
    .nonempty()
    .min(5, "Title Must be atleat 5 characters Long"),
  category: z
    .string()
    .trim()
    .nonempty()
    .min(5, "Title Must be atleat 5 characters Long"),
  content: z
    .string()
    .trim()
    .nonempty()
    .min(20, "Content Must be atleast 20 character long"),
});

const EditBlog = () => {
  const [loading, setLoading] = useState(false);
  // Handleing the File selection States
  // const [blog, setBlog] = useState({});
  const { blogId } = useParams();
  const [thumbnail, setThumbnail] = useState("");
  const [file, setFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      content: "",
    },
  });

  const handleFileSelection = (file) => {
    try {
      const image = file[0];
      const newAvatarURL = URL.createObjectURL(image);
      setFile(image);
      setThumbnail(newAvatarURL);
      //console.log(image);
    } catch (err) {
      //console.log(err);
    }
  };

  // Fetching the categories from the server to display in the select field
  const [categoryies, setCategories] = useState([]);
  const getBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/blog/get/${blogId}`
      );
      if (response.status === 200) {
        // //console.log(response.data.blog);
        // setBlog([...response.data.blog]);
        form.setValue("title", response.data.blog.title);
        form.setValue("slug", response.data.blog.slug);
        //console.log(response.data.blog.category.category);
        form.setValue("category", response.data.blog.category._id);
        form.setValue("content", decode(response.data.blog.content));
        setThumbnail(response.data.blog.thumbnail);
      }
    } catch (err) {
      //console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/category/getall`
      );
      if (response.status === 200) {
        //console.log(response.data.categories);
        setCategories([...response.data.categories]);
      }
    } catch (err) {
      //console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (values) => {
    const formBody = new FormData();
    formBody.append("thumbnail", file);
    formBody.append("title", values.title);
    formBody.append("slug", values.slug);
    formBody.append("category", values.category);
    formBody.append("content", values.content);
    formBody.append("data", JSON.stringify(values));
    for (let [key, value] of formBody.entries()) {
      //console.log(key, value);
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/blog/edit/${blogId}`,
        formBody
      );
      if (response.status == 200) {
        // dispatch(setUser({ user: response.data.user }));
        getBlog();
        //console.log(response.data.message);
        toast.success(response.data.message);
        // navigate("/");
      }
    } catch (err) {
      //console.log(err.response.data);
      //console.log(err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateSlug = () => {
      const change = form.watch("title");
      if (change) {
        form.setValue("slug", slugify(change, { lower: true }));
      }
    };
    updateSlug();
  });

  useEffect(() => {
    getBlog();
  }, []);
  if (loading) return <Loader></Loader>;
  return (
    <>
      <Card className={"w-[95%] mx-auto"}>
        <CardHeader className={"text-2xl font-semibold"}>
          Create a Blog
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className={"w-full h-fit border-2 border-dotted rounded-md"}>
                <Dropzone
                  className={"w-full h-fit border-2 border-dotted rounded-md"}
                  onDrop={(acceptedFiles) =>
                    handleFileSelection(acceptedFiles)
                  }>
                  {({ getRootProps, getInputProps }) => (
                    <section
                      className={
                        "w-full h-fit border-2 border-dotted rounded-md"
                      }>
                      <div
                        {...getRootProps()}
                        className="w-full h-full flex justify-center items-center">
                        <input {...getInputProps()} />

                        {thumbnail === "" ? (
                          <div className="w-full h-full p-5 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-dotted">
                              <IoImage className="text-4xl text-gray-600" />
                            </div>
                            <p className="text-gray-600">
                              Drag 'n' drop thumbnail here, or click to select a
                              files
                            </p>
                          </div>
                        ) : (
                          <>
                            <img
                              src={thumbnail}
                              alt="thumbnail"
                              className="w-full h-full object-cover items-center rounded-md"
                            />
                          </>
                        )}
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        className="w-full"
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryies.map((category) => (
                            <SelectItem value={category._id} key={category._id}>
                              {category.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl>
                      <TextEditor
                        value={field.value}
                        onChange={(e) => {
                          form.setValue("content", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default EditBlog;
