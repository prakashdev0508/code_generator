import { Button } from "@/components/ui/button";
import {prisma} from "@/lib/db";

export default async function Home() {
  return (
    <>
      <Button variant={"outline"} > Hii There </Button>
    </>
  );
}
