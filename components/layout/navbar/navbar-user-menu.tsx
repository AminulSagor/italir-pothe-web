"use client";

const NavbarUserMenu = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold">Root Admin</p>
        <p className="text-xs text-muted-foreground">System Oversight</p>
      </div>

      <div className="size-9 rounded-full bg-green-100" />
    </div>
  );
};

export default NavbarUserMenu;
