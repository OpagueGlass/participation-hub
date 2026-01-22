"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

type InputTagsProps = {
  className?: string;
  value: string[];
  schema?: z.ZodEmail;
  description?: string;
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, schema, description, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [visibleCount, setVisibleCount] = React.useState(200);
    const arrSchema = schema ? z.array(schema) : null;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Lazy load more items on scroll
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        // Load more when scrolled near bottom (within 100px)
        if (scrollHeight - scrollTop - clientHeight < 100 && visibleCount < value.length) {
          setVisibleCount((prev) => Math.min(prev + 200, value.length));
        }
      };

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, [visibleCount, value.length]);

    // Reset visible count when value changes significantly
    React.useEffect(() => {
      if (value.length < visibleCount) {
        setVisibleCount(Math.min(100, value.length));
      }
    }, [value.length]);

    // Check if we need to load more on mount/value change
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const { scrollHeight, clientHeight } = container;
        // If content doesn't fill the container, load more
        if (scrollHeight <= clientHeight && visibleCount < value.length) {
          setVisibleCount(Math.min(visibleCount + 100, value.length));
        }
      }, 0);

      return () => clearTimeout(timer);
    }, [value, visibleCount]);

    // Helper to validate and add data points (single or CSV)
    const validateAndAdd = (input: string) => {
      const items = input.split(",").map((item) => item.trim());

      if (arrSchema) {
        const result = arrSchema.safeParse(items);
        if (!result.success) {
          setError(result.error.issues[0].message);
          return;
        }
      }
      const newDataPoints = new Set([...value, ...items]);
      onChange(Array.from(newDataPoints));
      setError(null);
      setPendingDataPoint("");
    };

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        validateAndAdd(pendingDataPoint);
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        validateAndAdd(pendingDataPoint);
      }
    };

    return (
      <div className="space-y-2">
        <div
          ref={containerRef}
          className={cn(
            // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
            "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:border-ring dark:has-[:focus-visible]:ring-neutral-300 min-h-[20vh] max-h-48 overflow-y-auto flex w-full flex-wrap content-start gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white  disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 cursor-text",
            className,
          )}
          onClick={() => {
            inputRef.current?.focus();
          }}
        >
          {value.slice(0, visibleCount).map((item) => (
            <Badge key={item} variant="secondary">
              {item}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value.filter((i) => i !== item));
                }}
              >
                <XIcon className="w-3" />
              </Button>
            </Badge>
          ))}
          {value.length > visibleCount && (
            <Badge variant="outline" className="text-muted-foreground" onClick={(e) => e.stopPropagation()}>
              +{value.length - visibleCount} more (scroll to load)
            </Badge>
          )}
          <input
            className="flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addPendingDataPoint();
              } else if (e.key === "Backspace" && pendingDataPoint.length === 0 && value.length > 0) {
                e.preventDefault();
                onChange(value.slice(0, -1));
              }
            }}
            {...props}
            ref={inputRef}
          />
        </div>
        {!error ? <FieldDescription>{description}</FieldDescription> : <FieldError>{error}</FieldError>}
      </div>
    );
  },
);

InputTags.displayName = "InputTags";

export { InputTags };
