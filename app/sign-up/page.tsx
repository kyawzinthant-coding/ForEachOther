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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import toast from "react-hot-toast";
import { RegisterAccount } from "./action";
import { NextResponse } from "next/server";

const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { result, execute, status } = useAction(RegisterAccount);

  function onSubmit(values: z.infer<typeof formSchema>) {
    execute(values);
    console.log(values);
  }

  useEffect(() => {
    console.log("result", result.data);
    if (result.data?.data && status === "hasSucceeded") {
      toast.success(`Success  ${result.data} `);
      NextResponse.redirect(`${process.env.HOST_NAME}/login`);
    } else if (result.data) {
      toast.error(result.data.error?.message);
    }
  }, [result, status]);

  return (
    <div className="flex flex-row h-screen w-full items-center justify-center">
      <div className="w-[500px]">
        <Card className="p-12 sm:mx-16">
          <div className="space-y-2 mb-4 text-center">
            <h1 className="text-3xl font-bold">Register Account</h1>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Please fill in the form to Create an account
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
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Register</Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
