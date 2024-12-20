"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/validation/Login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginAction } from "./actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import userStore from "@/store/userStore";

const LoginPage = () => {
  const { setUser } = userStore();
  const [loading, setLoading] = useState(false); // Loading state

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { result, execute } = useAction(LoginAction);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true); // Start loading
    try {
      await execute(values);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (result.data) {
      if (result.data.status === "success") {
        const { uid, name } = result.data.data;
        if (uid && name) {
          console.log(uid, name);
          setUser(uid, name);
          console.log("success seeding");
        }

        toast.success("Login Successful");
        router.push("/home");
      } else {
        toast.error((result.data.error as string) || "Login failed");
      }
    }
  }, [result, router, setUser]);

  return (
    <div className="flex flex-row h-screen w-full items-center justify-center">
      <div className="w-[500px]">
        <Card className="p-12 sm:mx-16">
          <div className="space-y-2 mb-4 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Please fill in the form to login to your account.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
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
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
