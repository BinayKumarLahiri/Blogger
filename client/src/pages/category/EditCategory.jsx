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
import { IoAdd } from "react-icons/io5";
import slugify from "slugify";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
axios.defaults.withCredentials = true;

const formSchema = z.object({
  category: z
    .string()
    .trim()
    .nonempty("Category Name Can't be Empty")
    .min(5, "Category Name Must be atleast 5 characters long"),
  slug: z
    .string()
    .trim()
    .nonempty("Slug Can't be Empty")
    .min(5, "Slug Must be atleast 5 characters long"),
});

const EditCategory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { categoryid } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        //console.log(categoryid);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/category/get/${categoryid}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          form.setValue("category", response.data.category.category);
          form.setValue("slug", response.data.category.slug);
          toast.success(response.data.message);
        }
      } catch (err) {
        //console.log(err);
        toast.error(err.response.data.message);
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      slug: "",
    },
  });
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/category/edit/${categoryid}`,
        values,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        //console.log(response.data.message);
        toast.success(response.data.message);
      }
    } catch (err) {
      //console.log(err);
      //console.log(err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateSlug = () => {
      const change = form.watch("category");
      if (change) {
        form.setValue("slug", slugify(change, { lower: true }));
      }
    };
    updateSlug();
  });
  if (loading) return <Loader></Loader>;
  return (
    <Card className={"w-[95%] mx-auto"}>
      <CardHeader className={"text-xl font-semibold"}>
        Add a new Category
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category Name" {...field} />
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
                    <Input placeholder="category-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className={"cursor-pointer"}>
              <div className="w-full h-full flex items-center justify-center gap-2">
                <IoAdd />
                Save
              </div>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditCategory;
