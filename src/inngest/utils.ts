import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export const getSandBox = async (sandboxId: string) => {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
};

export const lastAssistanceMessage = (result: AgentResult) => {
  const lastmessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastmessageIndex] as TextMessage | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((m) => m.text).join("")
    : undefined;
};
