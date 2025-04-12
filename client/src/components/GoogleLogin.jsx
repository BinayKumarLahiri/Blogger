import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { setUser } from "@/redux/user/user.slice";
axios.defaults.withCredentials = true;

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      // //console.log(googleResponse);
      const user = googleResponse.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };
      //console.log(userData);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/google-login`,
        userData,
        {
          withCredentials: true,
        }
      );
      //console.log(response.status);
      if (response.status == 200) {
        //console.log(response.data.user, response.data.token);
        dispatch(
          setUser({ user: response.data.user, token: response.data.token })
        );
        //console.log(response.data.message);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (err) {
      //console.log(err.response.data.message);
      toast.error(err.response.data.message);
    }
  };
  return (
    <>
      <div className="m-2">
        <Button
          variant={"outline"}
          className={"w-full p-3"}
          onClick={handleLogin}>
          <FcGoogle />
          Continue with Google
        </Button>
        <div className="w-full flex items-center justify-between mt-2">
          <span className="w-[45%] border border-gray-750"></span>
          <span className="text-sm text-gray-800">or</span>
          <span className="w-[45%] border border-gray-750"></span>
        </div>
      </div>
    </>
  );
};

export default GoogleLogin;
