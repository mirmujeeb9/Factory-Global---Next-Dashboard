import { useClerk } from "@clerk/nextjs";

const UserTag = () => {
  const { user } = useClerk();

  return (
    <div className="w-full py-2 px-2">
      <h1 className="text-[14px] font-semibold">Email</h1>
      <p className="text-[14px] text-gray-400">
        {user?.primaryEmailAddress?.toString()}
      </p>
    </div>
  );
};

export default UserTag;
