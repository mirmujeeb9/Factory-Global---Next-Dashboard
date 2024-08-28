import { useOrganization } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import SignOut from "../SignOut";
import BrandTag from "./BrandTag";
import ProfilePic from "./ProfilePic";
import SupplierTag from "./SupplierTag";
import UserTag from "./UserTag";

const MainMenu = () => {
  const { organization } = useOrganization();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ProfilePic />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 w-[220px]">
          <UserTag />

          {organization?.publicMetadata?.type === "brand" && <BrandTag />}
          {organization?.publicMetadata?.type === "supplier" && <SupplierTag />}

          <SignOut />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MainMenu;
