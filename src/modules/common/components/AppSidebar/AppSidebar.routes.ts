import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";

export const Routes = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billings",
    url: "/billings",
    icon: CreditCard,
  },
];
