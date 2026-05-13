"use client";

import { Bell, HelpCircle } from "lucide-react";

const NavbarActions = () => {
  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Notifications">
        <Bell className="size-5" />
      </button>

      <button type="button" aria-label="Help">
        <HelpCircle className="size-5" />
      </button>
    </div>
  );
};

export default NavbarActions;
