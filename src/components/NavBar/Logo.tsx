import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="font-semibold h-full flex items-center">Kno Global</div>
    </Link>
  );
};

export default Logo;