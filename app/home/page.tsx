"use client";
import userStore from "@/store/userStore";
import React, { useEffect } from "react";
import Cookies from "js-cookie";

const HomePage = () => {
  const { user, setUser, clearUser } = userStore();

  const sessionID = Cookies.get("auth_session");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/session/${sessionID}`);

        console.log(res);

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setUser(data.uid, data.email);
        } else {
          clearUser();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        clearUser();
      }
    };

    fetchUser();
  }, [setUser, clearUser, sessionID]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return <div>HomePage</div>;
};

export default HomePage;
