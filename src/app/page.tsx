import { Button } from "@/components/ui/button";
import { caller } from "@/trpc/server";

export default async function Home() {
  // You can use the `caller` to call your TRPC procedures directly
  const {greeting} = await caller.createAi({
    text: "Prakash",})
  return (
    <>
      <Button variant={"outline"} > Hii There </Button>
      <p >{greeting}</p>
    </>
  );
}
