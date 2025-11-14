import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div
        className={cn(
          "w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

interface AuthCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCardHeader({ children, className, ...props }: AuthCardHeaderProps) {
  return (
    <div className={cn("space-y-2 text-center", className)} {...props}>
      {children}
    </div>
  );
}

interface AuthCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function AuthCardTitle({ children, className, ...props }: AuthCardTitleProps) {
  return (
    <h1 className={cn("text-2xl font-bold tracking-tight text-slate-900", className)} {...props}>
      {children}
    </h1>
  );
}

interface AuthCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function AuthCardDescription({ children, className, ...props }: AuthCardDescriptionProps) {
  return (
    <p className={cn("text-sm text-slate-600", className)} {...props}>
      {children}
    </p>
  );
}

interface AuthCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCardContent({ children, className, ...props }: AuthCardContentProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

interface AuthCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCardFooter({ children, className, ...props }: AuthCardFooterProps) {
  return (
    <div className={cn("text-center text-sm text-slate-600", className)} {...props}>
      {children}
    </div>
  );
}
