"use client";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  return <div>{user?.firstName}</div>;
}
