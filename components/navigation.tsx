import { ModeToggle } from "@/components/mode-toggle";
import UserManagement from "@/components/user-management";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Navigation() {
  return (
    <div className="w-full bg-muted">
      <div className="container flex justify-between py-2">
        <Link href="/" className="font-bold">
          ZSU Screenshots
        </Link>
        <div className="flex space-x-2">
          <Link href="/upload" className={buttonVariants({ size: "sm" })}>
            Upload
          </Link>
          <ModeToggle />
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
