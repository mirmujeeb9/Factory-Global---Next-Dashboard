import { auth } from "@clerk/nextjs/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { userId, orgId, has, protect, orgSlug } = auth();

  protect();

  return <>{children}</>;
}
