import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { getModel } from "@/lib/providers";
import { getSkillById } from "@/lib/skills";
import { demoTools } from "@/lib/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, skillId } = await req.json();

  const skill = getSkillById(skillId ?? "default");
  const systemPrompt = skill?.content ?? "あなたは親切なAIアシスタントです。";

  const modelMessages = await convertToModelMessages(messages, {
    tools: demoTools,
  });

  const result = streamText({
    model: getModel(),
    system: systemPrompt,
    messages: modelMessages,
    tools: demoTools,
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
