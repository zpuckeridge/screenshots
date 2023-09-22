import { UserButton } from "@clerk/nextjs";

export default function UserManagement() {
  return <UserButton afterSignOutUrl="/" />;
}
