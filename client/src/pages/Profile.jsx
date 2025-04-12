import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { string, z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Dropzone from "react-dropzone";
import { MdOutlineCameraAlt } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { setUser } from "@/redux/user/user.slice";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name Field Can't be empty")
    .min(3, "Name Must be atleast 3 characters long."),
  email: z
    .string()
    .trim()
    .nonempty("Email Field Can't be Empty")
    .email("Email Must be a valid Email"),
  bio: z.string().trim().nonempty(),
  password: z.string().optional(),
});

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState(user?.user?.avatar || "");
  const [file, setFile] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.user.name,
      email: user.user.email,
      bio: user.user.bio || "",
      password: "",
    },
  });
  const onSubmit = async (values) => {
    const formBody = new FormData();
    formBody.append("avatar", file);
    formBody.append("name", values.name);
    formBody.append("email", values.email);
    formBody.append("bio", values.bio);
    formBody.append("password", values.password);

    //console.log(values);
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/update-profile/${
          user.user.id
        }`,
        formBody
      );
      if (response.status == 200) {
        dispatch(setUser({ user: response.data.user }));
        //console.log(response.data.message);
        toast.success(response.data.message);
        // navigate("/");
      }
    } catch (err) {
      //console.log(err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = (file) => {
    try {
      const image = file[0];
      const newAvatarURL = URL.createObjectURL(image);
      setFile(image);
      setAvatar(newAvatarURL);
      //console.log(image);
    } catch (err) {
      //console.log(err);
    }
  };
  if (loading) return <Loader></Loader>;
  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <Card className={"md:w-[80%] w-full"}>
          <CardHeader>
            <CardTitle className={"text-2xl"}>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full flex flex-col items-center justify-center">
              <Dropzone
                onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                className="group">
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Avatar className={"w-24 h-24  cursor-pointer"}>
                        <AvatarImage src={avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                        <div className="w-24 h-24 bg-gray-800 opacity-0 hover:opacity-40 absolute top-0 left-0 flex items-center justify-center group">
                          <MdOutlineCameraAlt className="w-10 h-10 group-hover:text-gray-200" />
                        </div>
                      </Avatar>
                    </div>
                  </section>
                )}
              </Dropzone>
              <p className="text-2xl font-light">{user.user.name}</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="User Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type={"email"}
                          placeholder="Email"
                          {...field}
                          disabled={true}
                        />
                      </FormControl>
                      <FormDescription>
                        Email is Linked to your account which can't be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        {/* <Input type={"email"} placeholder="Email" {...field} /> */}
                        <Textarea placeholder="Bio" {...field}></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={"password"}
                          placeholder="Password"
                          {...field}
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
      </div>
    </>
  );
};

export default Profile;
