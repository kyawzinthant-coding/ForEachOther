"use client";
import Cookies from "js-cookie";

import userStore from "@/store/userStore";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { user, clearUser } = userStore();
  const router = useRouter();

  const logout = () => {
    Cookies.remove("auth_session", { path: "/" });
    clearUser();
    router.push("/");
  };

  const pf = user?.name.startsWith("n") ? "N" : "K";

  return (
    <div className="flex justify-end items-center space-x-4 w-full">
      <div className="w-[250px] p-2 rounded-md shadow flex items-center space-x-4 border bg-white ">
        <div className="w-[40px] h-[40px] bg-[#eee] font-bold flex justify-center items-center  rounded-full">
          {pf}
        </div>
        <h3 className="font-bold text-14">{user?.name}</h3>
      </div>

      <div onClick={logout} className="cursor-pointer">
        <Image
          src="/images/poweroff.png"
          alt="poweroff"
          width={40}
          height={40}
        />
      </div>
    </div>
  );
};

export default NavBar;
