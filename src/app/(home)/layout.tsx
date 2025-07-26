import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-fit max-h-fit ">
      <div className="absolute inset-0 -z-10 h-screen  w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]  " />
      <div className="flex flex-col px-4 pb-6 ">{children}</div>
    </main>
  );
};

export default Layout;
