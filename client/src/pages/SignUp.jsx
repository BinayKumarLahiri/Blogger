import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "@/components/GoogleLogin";
axios.defaults.withCredentials = true;

const formSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters long"),
  email: z.string().email("Email must be a valid email"),
  password: z.string().min(8, "Password must be atleast 8 characters long."),
  confirmpassword: z
    .string()
    .refine(
      (data) => data.password === data.confirmpassword,
      "Password and Confirm Password must be same."
    ),
});

const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/register`,
        values
      );
      if (response.status == 200) {
        //console.log(response.data.message);
        toast.success(response.data.message);
        navigate("/signin");
      }
    } catch (err) {
      //console.log(err.response.data.message);
      toast.error(err.response.data.message);
    }
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className={"w-[95%] md:w-1/3"}>
        <CardHeader className={"text-2xl font-semibold text-center"}>
          Create your Account
        </CardHeader>
        <CardContent>
          <GoogleLogin />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jhon Doe" {...field} />
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
                      <Input placeholder="jhondoe@example.com" {...field} />
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
                        placeholder="Enter Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type={"password"}
                        placeholder="Enter Password Again"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full">
                <Button type="submit" className={"w-full"}>
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
          <CardFooter
            className={
              "w-full flex items-center justify-center gap-2 text-sm mt-1"
            }>
            <p>
              Already Have an Account?
              <Link to="/signin" className="text-blue-700 hover:text-blue-800">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
