import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const SignOut = () => {
  const { signOut } = useClerk();

  return (
    <DropdownMenuItem
      className="w-full flex items-center"
      onClick={() => signOut({ redirectUrl: "/" })}
    >
      <LogOut size={14} className="mr-2" />
      Sign out
    </DropdownMenuItem>
  );
};

export default SignOut;