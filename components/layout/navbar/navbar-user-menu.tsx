"use client";

import { IMAGE } from "@/constant/image.path";
import Image from "next/image";

const NavbarUserMenu = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold">Root Admin</p>
        <p className="text-xs text-muted-foreground">System Oversight</p>
      </div>

      <div className="relative size-9 overflow-hidden rounded-full ring-2 ring-green-100">
        <Image
          src={IMAGE.customer}
          alt="Root Admin"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default NavbarUserMenu;
