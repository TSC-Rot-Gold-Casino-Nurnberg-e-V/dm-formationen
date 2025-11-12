import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const EventDateChip = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={twMerge(
      "flex mx-auto w-fit items-center gap-2 bg-primary-300 rounded-full text-sm text-primary-900 font-semibold px-3 py-1",
      className,
    )}
    {...props}
  >
    <CalendarDaysIcon className="shrink-0 size-5" />
    <div>7. November 2026</div>
  </div>
);
