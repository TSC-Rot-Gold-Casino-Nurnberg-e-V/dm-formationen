"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { ComponentProps, PropsWithChildren, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/zeitplan", label: "Zeitplan" },
  { href: "/teams", label: "Teams" },
  { href: "/hotels", label: "Hotels" },
  { href: "/presse", label: "Presse" },
  { href: "/livestream", label: "Livestream" },
  { href: "/anfahrt", label: "Anfahrt" },
];

export const Navigation = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isTicketPage = pathname === "/tickets";

  return (
    <header className="w-screen sticky top-0 bg-base-900/90">
      <nav className="container flex items-center justify-between max-sm:px-2">
        <button
          className="sm:hidden p-2 w-fit rounded cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <XMarkIcon className="size-6 text-base-200" />
          ) : (
            <Bars3Icon className="size-6 text-base-200" />
          )}
        </button>

        {/* Desktop nav */}
        <div className="max-sm:hidden overflow-x-auto max-w-full">
          <ul className="flex flex-nowrap whitespace-nowrap ml-auto w-fit">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <BrandLink href={item.href}>{item.label}</BrandLink>
              </li>
            ))}
          </ul>
        </div>
        {!isTicketPage && (
          <Link
            href="/tickets"
            className="block shrink-0 w-fit ml-2 bg-secondary-700 text-sm hover:bg-secondary-600 px-3 py-1 rounded-full transition-colors font-bold cursor-pointer !text-white"
          >
            Tickets sichern
          </Link>
        )}

        {/* Mobile nav */}
        {open && (
          <div className="sm:hidden bg-base-900/95 absolute left-0 right-0 top-full shadow-lg">
            <ul className="flex flex-col py-2 px-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <BrandLink
                    href={item.href}
                    className="text-left"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </BrandLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

const BrandLink = ({
  href,
  className,
  children,
  ...props
}: PropsWithChildren<ComponentProps<"a"> & { href: string }>) => (
  <Link
    href={href}
    className={twMerge(
      "px-2 py-3 hover:text-white text-base-200 transition-colors block rounded-full",
      className,
    )}
    {...props}
  >
    {children}
  </Link>
);
