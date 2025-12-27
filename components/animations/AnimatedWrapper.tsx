"use client";

import { animated } from "@react-spring/web";
import { forwardRef, HTMLAttributes } from "react";

interface AnimatedDivProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  children?: any;
  style?: any;
}

interface AnimatedSpanProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  children?: any;
  style?: any;
}

// Properly typed animated div wrapper for React 19
export const AnimatedDiv = forwardRef<HTMLDivElement, AnimatedDivProps>(
  ({ children, style, ...props }, ref) => {
    const AnimatedComponent = animated.div as any;
    return (
      <AnimatedComponent ref={ref} style={style} {...props}>
        {children}
      </AnimatedComponent>
    );
  }
);
AnimatedDiv.displayName = "AnimatedDiv";

// Properly typed animated span wrapper for React 19
export const AnimatedSpan = forwardRef<HTMLSpanElement, AnimatedSpanProps>(
  ({ children, style, ...props }, ref) => {
    const AnimatedComponent = animated.span as any;
    return (
      <AnimatedComponent ref={ref} style={style} {...props}>
        {children}
      </AnimatedComponent>
    );
  }
);
AnimatedSpan.displayName = "AnimatedSpan";

// Properly typed animated line wrapper for SVG
export const AnimatedLine = ({ style, ...props }: {
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  stroke?: string;
  strokeWidth?: string;
  strokeDasharray?: string;
  className?: string;
  style?: any;
}) => {
  const AnimatedComponent = animated.line as any;
  return <AnimatedComponent style={style} {...props} />;
};
