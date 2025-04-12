import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LuSquareUserRound } from "react-icons/lu";
import { IoAddSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { removeUser } from "@/redux/user/user.slice";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileDrawer = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/logout`
      );
      if (response.status == 200) {
        dispatch(removeUser());
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
      <DropdownMenu className="mx-5">
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.user.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p>{user.user.name}</p>
            <p className="text-sm font-light">{user.user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={"/profile"}>
              <LuSquareUserRound />
              <p>Profile</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={"/blog/create"}>
              <IoAddSharp />
              <p>Create Blog</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild onClick={handleLogout}>
            <div>
              <MdLogout className="text-red-500" />
              <p>Logout</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileDrawer;
//"https://github.com/shadcn.png"
