"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  Globe,
  Phone,
} from "lucide-react";

const features = [
  {
    title: "Exam Whisperer",
    href: "/exam-whisperer",
    description: "Ask questions while studying and get instant explanations with interactive quizzes.",
    icon: BookOpen,
    badge: "AI-Powered",
  },
  {
    title: "Language Buddy",
    href: "/language-buddy",
    description: "Practice conversations with accent correction and cultural insights.",
    icon: Globe,
    badge: "Voice AI",
  },
  {
    title: "Parent Portal",
    href: "/parent-portal",
    description: "Voice-activated progress summaries and meeting scheduling.",
    icon: Phone,
    badge: "Voice Control",
  },
];

const resources = [
  {
    title: "Study Analytics",
    href: "/analytics",
    description: "Track your learning progress and identify areas for improvement.",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Customize your learning experience and preferences.",
    icon: Settings,
  },
  {
    title: "Help Center",
    href: "/help",
    description: "Get support and learn how to make the most of Explain It.",
    icon: HelpCircle,
  },
  {
    title: "About Us",
    href: "/about",
    description: "Learn about our mission and team.",
    icon: Users,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    const authToken = localStorage.getItem("auth-token");
    setIsLoggedIn(!!(userData && authToken));
  }, []);

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="hidden font-bold sm:inline-block text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Explain It
        </span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {isLoggedIn && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                  pathname === "/dashboard" && "bg-accent text-accent-foreground"
                )}
              >
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium">
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-accent/20 p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Explain It
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Your AI-powered learning companion for mastering any subject with personalized explanations and interactive practice.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {features.map((feature) => (
                  <ListItem
                    key={feature.title}
                    title={feature.title}
                    href={feature.href}
                    badge={feature.badge}
                    icon={feature.icon}
                  >
                    {feature.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium">
              Resources
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {resources.map((resource) => (
                  <ListItem
                    key={resource.title}
                    title={resource.title}
                    href={resource.href}
                    icon={resource.icon}
                  >
                    {resource.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                pathname === "/contact" && "bg-accent text-accent-foreground"
              )}
            >
              <Link href="/contact">
                Contact
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    badge?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
>(({ className, title, children, badge, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
            <div className="text-sm font-medium leading-none">{title}</div>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
