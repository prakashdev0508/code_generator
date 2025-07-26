import Image from "next/image";
import ProjectForm from "@/modules/home/components/project-form";
import ProjectList from "@/modules/home/components/project-list";

export default function Home() {
  return (
      <div className="flex flex-col max-w-5xl mx-auto w-full">
        <section className=" space-y-6 py-[16vh] 2xl:py-48 ">
          <div className="flex flex-col items-center ">
            <Image
              src="/logo2.png"
              alt="logo"
              width={50}
              height={50}
              className=" hidden md:block "
            />
          </div>
          <h1 className="text-2xl md:text-5xl  font-bold text-center ">
            Buid Something <span className="text-red-500">Awesome</span>
          </h1>
          <p className=" text-lg md:text-xl text-muted-foreground text-center  ">
            Create a website by chatting with AI{" "}
          </p>
          <div className="max-w-3xl mx-auto w-full ">
            <ProjectForm />
          </div>
        </section>
        <ProjectList />
      </div>
  );
}
