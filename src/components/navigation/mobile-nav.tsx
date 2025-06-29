"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen,
  Globe,
  Phone,
  BarChart3,
  Users,
  HelpCircle,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

const navigation = [
  {
    title: "Features",
    items: [
      {
        title: "Exam Whisperer",
        href: "/exam-whisperer",
        description: "AI-powered study companion",
        icon: BookOpen,
        badge: "AI-Powered",
      },
      {
        title: "Language Buddy",
        href: "/language-buddy",
        description: "Conversational practice with AI",
        icon: Globe,
        badge: "Voice AI",
      },
      {
        title: "Parent Portal",
        href: "/parent-portal",
        description: "Voice-controlled progress tracking",
        icon: Phone,
        badge: "Voice Control",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Study Analytics",
        href: "/analytics",
        description: "Track your learning progress",
        icon: BarChart3,
      },
      {
        title: "Community",
        href: "/community",
        description: "Connect with other learners",
        icon: Users,
      },
      {
        title: "Help Center",
        href: "/help",
        description: "Get support and guidance",
        icon: HelpCircle,
      },
    ],
  },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-[300px] sm:w-[350px]">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Explain It
            </span>
          </Link>
        </div>
        
        <div className="flex flex-col space-y-6">
          {navigation.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    href={item.href}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    badge={item.badge}
                    isActive={pathname === item.href}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Other
            </h4>
            <div className="space-y-1">
              <MobileNavItem
                href="/help"
                title="Help Center"
                description="Get support and guides"
                isActive={pathname === "/help"}
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col space-y-3">
            <Button className="w-full" onClick={() => setOpen(false)}>
              Get Started
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
              Sign In
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavItemProps {
  href: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
}

function MobileNavItem({
  href,
  title,
  description,
  icon: Icon,
  badge,
  isActive,
  onClick,
}: MobileNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {Icon && (
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium leading-none">{title}</p>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          {description}
        </p>
      </div>
    </Link>
  );
}
