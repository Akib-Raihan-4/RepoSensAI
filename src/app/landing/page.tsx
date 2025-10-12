import LandingClient from "@/modules/LandingPage/components/LandingClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return <LandingClient />;
}
