'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SmartGetStartedButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  showIcon?: boolean;
}

export function SmartGetStartedButton({
  size = 'lg',
  variant = 'default',
  className,
  showIcon = true
}: SmartGetStartedButtonProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Always show the default button during SSR and initial load
  if (isLoading) {
    return (
      <Button
        size={size}
        variant={variant}
        className={cn("h-12 px-8 text-base", className)}
        asChild
      >
        <Link href="/signup">
          Get Started Free
          {showIcon && <ArrowRight className="ml-2 h-4 w-4" />}
        </Link>
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        size={size}
        variant={variant}
        className={cn("h-12 px-8 text-base", className)}
        asChild
      >
        <Link href="/dashboard">
          {showIcon && <User className="mr-2 h-4 w-4" />}
          Go to Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={cn("h-12 px-8 text-base", className)}
      asChild
    >
      <Link href="/signup">
        Get Started Free
        {showIcon && <ArrowRight className="ml-2 h-4 w-4" />}
      </Link>
    </Button>
  );
}
