"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { IMAGE } from "@/constant/image.path";
import {
  formatUserRole,
  getAuthUser,
  type AuthUser,
} from "@/utils/auth_user_util";

const NavbarUserMenu = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const fullName = user?.fullName || "Admin";
  const role = formatUserRole(user?.role);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold">{fullName}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>

      <div className="relative size-9 overflow-hidden rounded-full ring-2 ring-green-100">
        <Image
          src={IMAGE.customer}
          alt={fullName}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default NavbarUserMenu;
