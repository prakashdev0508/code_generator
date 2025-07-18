import {
  gemini,
  openai,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandBox, lastAssistanceMessage } from "./utils";
import z from "zod";
import { PROMPT } from "./prompt";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("code-gen-nextjs-2");
      return sandbox.sandboxId;
    });

    const writer = createAgent({
      name: "code-agent ",
      description: "An Expert Coding agent",
      system: `${PROMPT}`,
      model: openai({
        model: "gpt-4o",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use theterminal to run commands in the sandbox",

          handler: async ({ command }, { step }) => {
            return step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandBox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data.toString();
                  },
                  onStderr: (data) => {
                    buffers.stderr += data.toString();
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Error running command: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
                );

                return `Error running command: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFile",
          description: "Create or update a file in the sandbox",
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run("createOrUpdateFile", async () => {
              try {
                const updateFiles = network.state.data.files || {};

                const sandbox = await getSandBox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path] = file.content;
                }

                return updateFiles;
              } catch (e) {
                return `Error : ${e}`;
              }
            });
            if (typeof newFiles === "object") {
              return (network.state.data.files = newFiles);
            }
          },
        }),
        createTool({
          name: "readfiles",
          description: "Read files from the sandbox",

          handler: async ({ files }, { step, network }) => {
            return step?.run("readfiles", async () => {
              try {
                const sandbox = await getSandBox(sandboxId);
                const content = [];

                for (const file of files) {
                  const fileContent = await sandbox.files.read(file);
                  content.push({ path: file, content: fileContent });
                }
                return JSON.stringify(content);
              } catch (e) {
                return `Error : ${e}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistanceMessageText = lastAssistanceMessage(result);

          if (lastAssistanceMessageText && network) {
            if (lastAssistanceMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistanceMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "code-agent",
      agents: [writer],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return writer;
      },
    });
    // to call your AI model.
    const result = await network.run(event.data.value);
    const sandBoxURl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandBox(sandboxId);
      const host = sandbox.getHost(3000);

      return `http://${host}`;
    });

    return {
      url: sandBoxURl,
      title: "Code Generation Result",
      summary: result.state.data.summary,
      files: result.state.data.files || {},
    };
  }
);
