import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen h-screen grid grid-cols-[auto_1fr] items-center">
      <div className="px-8 shadow-lg border-r-[1px] bg-gray-50 border-r-black/[0.1] h-full flex flex-col items-center justify-center">
        <div className="w-[400px]"></div>
        <ClerkLoading>
          <div className="w-[400px] p-5 h-[400px] flex flex-col gap-2 justify-between bg-gray-100 animate-pulse">
            <div className="flex flex-col gap-2">
              <div className="w-[30%] h-6 bg-gray-200 mb-10 animate-pulse rounded-md"></div>
              <div className="w-full h-6 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="w-full h-6 bg-gray-200 animate-pulse rounded-md"></div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="w-full mt-10 h-6 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="w-full h-6 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <SignIn
            appearance={{
              layout: {
                animations: true,
                logoImageUrl:
                  "https://assets-global.website-files.com/62b5df7ffeeafed326226b1d/62b5e43c8165e9356bf5687f_Kno%20Logo.svg",
              },
              variables: {
                borderRadius: "0.275rem",
              },
            }}
            path="/sign-in"
            signUpForceRedirectUrl={"/join"}
          />
        </ClerkLoaded>
      </div>
      <div className="h-full flex items-center from-[#FFB200] to-[#fdd77e] bg-gradient-to-br justify-center">
        {/* Some marketing content goes here */}
      </div>
    </div>
  );
}
