import {
  gemini,
  openai,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandBox, lastAssistanceMessage } from "./utils";
import { PROMPT } from "./prompt";
import { prisma } from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("code-gen-nextjs-2");
      return sandbox.sandboxId;
    });

    const writer = createAgent<AgentState>({
      name: "code-agent ",
      description: "An Expert Coding agent",
      system: `${PROMPT}`,
      model: openai({
        model: "gpt-4.1",
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
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
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

    const network = createNetwork<AgentState>({
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
    const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

    await step.run('save-url', async () => {
      await prisma.message.create({
        data: {
          content: isError ? "Something went wrong please try again" : result.state.data.summary,
          role: "ASSISTANT",
          type: isError ? "ERROR" : "RESULT",
          projectId: event.data.projectId,
          ...(!isError ? {
            fragments: {
              create: {
                content: result.state.data.summary,
                sandboxUrl: sandBoxURl,
                title: "Fragment",
                files: result.state.data.files || {},
              }
            }
          } : {})
        }
      })
      return true;
    })

    return {
      url: sandBoxURl,
      title: "Code Generation Result",
      summary: result.state.data.summary,
      files: result.state.data.files || {},
    };
  }
);
