import { ModeToggle } from "@/components/mode-toggle";
import UserManagement from "@/components/user-management";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export default function Navigation() {
  return (
    <div className="w-full dark:bg-[#111111] bg-white border-b">
      <div className="container flex justify-between py-3">
        <Link href="/" className="flex gap-2">
          <Image
            src="https://zsu.gg/wp-content/uploads/2021/11/ZSU_trans_600.png"
            width={40}
            height={40}
            alt="ZSU Logo"
          />
          <span className="font-bold my-auto">ZSU - ArmA 3</span>
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
