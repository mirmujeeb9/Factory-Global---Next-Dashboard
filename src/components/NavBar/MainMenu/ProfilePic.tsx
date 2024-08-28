import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePic = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default ProfilePic;
