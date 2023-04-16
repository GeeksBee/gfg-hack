import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setShowSidebar } from "../../store/choices";
import { clearUser, storeOrganization, storeUser } from "../../store/user";
import { FaBrain, FaUserTie, FaWpforms } from "react-icons/fa";
import { TbBuildingBank, TbRoute } from "react-icons/tb";
import Confirmation from "../modal/confirmation";
import Cookies from "js-cookie";
import axios from "axios";
import {
  MdMiscellaneousServices,
  MdNotes,
  MdOndemandVideo,
  MdOutlineMessage,
  MdOutlineReviews,
} from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";
import {
  GiBookshelf,
  GiCargoCrate,
  GiCargoShip,
  GiNotebook,
  GiSuitcase,
} from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { BiBrain, BiSupport } from "react-icons/bi";
import { RiBook2Line } from "react-icons/ri";

const Siderbar = () => {
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const [logoutModal, setLogoutModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [route, setRoute] = useState();

  useEffect(() => {
    setRoute(router.pathname);
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        const [res1] = await Promise.all([
          axios.get("/api/auth/me", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              Cookies: `accessToken=${Cookies.get("accessToken")}`,
            },
            crossDomain: true,
          }),
        ]);
        dispatch(storeUser(res1.data));
      } catch (error) {
        if (error?.response?.data?.msg) {
          message.error(error.response.data.msg);
        }
        console.log(error);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        "/authentication/logout",
        {
          refreshToken: Cookies.get("refreshToken"),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            Cookies: `accessToken=${Cookies.get("accessToken")}`,
          },
          crossDomain: true,
        }
      );
      Cookies.remove("accessToken", { path: "" });
      Cookies.remove("refreshToken", { path: "" });
      dispatch(clearUser());
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`fixed z-50 w-screen h-screen sm:w-6/12 md:w-3/12 lg:w-2/12`}
    >
      {logoutModal && (
        <Confirmation
          text="Are you sure you want to logout ?"
          setShowModal={setLogoutModal}
          onOk={handleLogout}
        />
      )}
      <div className="bg-[#F4F1E9] h-full overflow-y-scroll w-full p-6">
        <Link passHref href="/">
          <div
            className="flex relative items-center justify-between cursor-pointer rounded-2xl mb-4"
            onClick={() => dispatch(setShowSidebar(false))}
          >
            <div className="flex items-center justify-center w-full h-7 font-semibold text-2xl -auto mt-1">
              Easy<span className="text-[#063FED] ml-[1px]">Ship</span>
            </div>
          </div>
        </Link>

        <hr className="border-gray-400 my-5" />

        <Link passHref href="/">
          <div
            className={`p-3 px-5 mb-1 flex items-center text-[#7d631b] justify-between cursor-pointer hover:bg-gray-400/[.2] rounded-xl ${
              route === "/" ? "bg-gray-400/[.2]" : "bg-transparent"
            }`}
            onClick={() => dispatch(setShowSidebar(false))}
          >
            <div className="flex items-center">
              <i className="fas fa-grip-horizontal"></i>
              <div className="text-quaternary-blue  text-sm font-medium h-full text-center ml-3">
                Dashboard
              </div>
            </div>
          </div>
        </Link>

        <Link passHref href="/progress">
          <div
            className={`p-3 px-5 mb-1 flex items-center text-[#7d631b] justify-between cursor-pointer hover:bg-gray-400/[.2] rounded-xl ${
              route === "/progress" ? "bg-gray-400/[.2]" : "bg-transparent"
            }`}
            onClick={() => dispatch(setShowSidebar(false))}
          >
            <div className="flex items-center">
              <GiCargoShip className="text-lg" />
              <div className="text-quaternary-blue  text-sm font-medium h-full text-center ml-3">
                In Progress
              </div>
            </div>
          </div>
        </Link>

        <Link passHref href="/shipment">
          <div
            className={`p-3 px-5 mb-1 flex items-center text-[#7d631b] justify-between cursor-pointer hover:bg-gray-400/[.2] rounded-xl ${
              route === "/shipment" ? "bg-gray-400/[.2]" : "bg-transparent"
            }`}
            onClick={() => dispatch(setShowSidebar(false))}
          >
            <div className="flex items-center">
              <GiCargoCrate className="text-lg" />
              <div className="text-quaternary-blue  text-sm font-medium h-full text-center ml-3">
                Shipments
              </div>
            </div>
          </div>
        </Link>

        <Link passHref href="/ports">
          <div
            className={`p-3 px-5 mb-1 flex items-center text-[#7d631b] justify-between cursor-pointer hover:bg-gray-400/[.2] rounded-xl ${
              route === "/ports" ? "bg-gray-400/[.2]" : "bg-transparent"
            }`}
            onClick={() => dispatch(setShowSidebar(false))}
          >
            <div className="flex items-center">
              <TbRoute className="text-lg" />
              <div className="text-quaternary-blue  text-sm font-medium h-full text-center ml-3">
                Ports
              </div>
            </div>
          </div>
        </Link>

        <Link passHref href="/support">
          <div
            className={`p-3 px-5 mb-1 flex items-center text-[#7d631b] justify-between cursor-pointer hover:bg-gray-400/[.2] rounded-xl ${
              route === "/support" ? "bg-gray-400/[.2]" : "bg-transparent"
            }`}
            onClick={() => dispatch(setShowSidebar(false))}
          >
            <div className="flex items-center">
              <BiSupport className="text-lg" />
              <div className="text-quaternary-blue  text-sm font-medium h-full text-center ml-3">
                Support
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Siderbar;
