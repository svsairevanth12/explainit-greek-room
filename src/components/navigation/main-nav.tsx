/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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
    title: "AI Tutor",
    href: "/dashboard",
    description: "Get personalized explanations for any topic with our AI-powered tutor.",
    icon: BookOpen,
  },
  {
    title: "Exam Whisperer",
    href: "/exam-whisperer",
    description: "Practice with AI-generated quizzes tailored to your learning level.",
    icon: BarChart3,
  },
  {
    title: "Language Buddy",
    href: "/language-buddy",
    description: "Learn languages through interactive conversations with AI.",
    icon: Globe,
  },
  {
    title: "Parent Portal",
    href: "/parent-portal",
    description: "Track your child's progress and get insights into their learning journey.",
    icon: Users,
    badge: "Family",
  },
];

const resources = [
  {
    title: "Help Center",
    href: "/help",
    description: "Find answers to common questions and get support.",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Customize your learning experience and preferences.",
    icon: Settings,
  },
  {
    title: "About Us",
    href: "/about",
    description: "Learn more about our mission and team.",
    icon: Users,
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch with our support team.",
    icon: Phone,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      const authToken = localStorage.getItem('auth-token');
      setIsLoggedIn(!!(userData && authToken));
    }
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
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    pathname === "/dashboard" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    pathname === "/analytics" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link href="/analytics">Analytics</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/dashboard"
                    >
                      <Sparkles className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        AI-Powered Learning
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Experience personalized education with our advanced AI tutoring system.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {features.map((feature) => (
                  <ListItem
                    key={feature.href}
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
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {resources.map((resource) => (
                  <ListItem
                    key={resource.href}
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
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    badge?: string;
    icon?: React.ComponentType<{ className?: string }>;
    href: string;
  }
>(({ className, title, children, badge, icon: Icon, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
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
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
