import { gemini, openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandBox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("code-gen-nextjs-2");
      return sandbox.sandboxId;
    });

    const writer = createAgent({
      name: "Code writer ",
      system:
        "You are an expert nextjs and reactjs code snippet writer. Write code that is clean, efficient, and follows best practices and with good ui using tailwind css classes if reqiured of styling. Always give only one code snippet in response which is best with no explanation just code snippet .",
      model: gemini({ model: "gemini-1.5-flash" }),
    });

    // Run the agent with an input.  This automatically uses steps
    // to call your AI model.
    const { output } = await writer.run(
      `Wirte the code for: ${event.data.email}`
    );

    const sandBoxURl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandBox(sandboxId);
      const host = sandbox.getHost(3000);

      return `http://${host}`;
    });



    return { message: output[0] , sandboxId, sandBoxURl  };
  }
);
