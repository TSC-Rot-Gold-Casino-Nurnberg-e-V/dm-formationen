import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { ComponentProps, PropsWithChildren } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/zeitplan", label: "Zeitplan" },
  { href: "/teams", label: "Teams" },
  // { href: "/tickets", label: "Tickets" },
  { href: "/hotels", label: "Hotels" },
  // { href: "/presse", label: "Presse" },
  // { href: "/livestream", label: "Livestream" },
  // { href: "/anfahrt", label: "Anfahrt" },
];

export const Navigation = () => (
  <header className="w-screen sticky top-0 bg-base-900/90">
    <nav className="container">
      <div className="overflow-x-auto max-w-full not-prose">
        <ul className="flex flex-nowrap whitespace-nowrap ml-auto w-fit">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <BrandLink href={item.href}>{item.label}</BrandLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </header>
);

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
