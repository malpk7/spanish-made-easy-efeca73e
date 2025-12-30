import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:shadow-md disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:shadow-md",
        outline: "border-2 border-primary bg-transparent text-primary shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md",
        ghost: "shadow-none hover:bg-muted hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
        hero: "bg-secondary text-secondary-foreground shadow-sm hover:shadow-lg transform hover:-translate-y-0.5",
        "hero-outline": "border-2 border-card bg-transparent text-card shadow-sm hover:shadow-md",
        gold: "bg-spanish-gold text-secondary-foreground shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base",
        xl: "h-16 rounded-xl px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
