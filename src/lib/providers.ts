import { createAzure } from "@ai-sdk/azure";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type LLMProvider = "azure-openai" | "azure-anthropic" | "openai";

const VALID_PROVIDERS: LLMProvider[] = [
  "azure-openai",
  "azure-anthropic",
  "openai",
];

export function getProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "azure-openai";
  if (!VALID_PROVIDERS.includes(provider as LLMProvider)) {
    throw new Error(
      `Invalid LLM_PROVIDER: ${provider}. Use one of: ${VALID_PROVIDERS.join(", ")}`
    );
  }
  return provider as LLMProvider;
}

export function getModel(): LanguageModel {
  const provider = getProvider();

  if (provider === "openai") {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const modelName = process.env.OPENAI_MODEL ?? "gpt-4o";
    return openai(modelName);
  }

  if (provider === "azure-openai") {
    const azure = createAzure({
      resourceName: extractResourceName(
        process.env.AZURE_OPENAI_ENDPOINT ?? ""
      ),
      apiKey: process.env.AZURE_OPENAI_API_KEY,
    });
    const deploymentName =
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "gpt-5.1";
    return azure(deploymentName);
  }

  // azure-anthropic
  const resource = process.env.AZURE_ANTHROPIC_RESOURCE ?? "";
  const anthropic = createAnthropic({
    baseURL: `https://${resource}.services.ai.azure.com/anthropic`,
    apiKey: process.env.AZURE_ANTHROPIC_API_KEY,
  });
  const modelName = process.env.AZURE_ANTHROPIC_MODEL ?? "claude-sonnet-4-5";
  return anthropic(modelName);
}

function extractResourceName(endpoint: string): string {
  try {
    const url = new URL(endpoint);
    return url.hostname.split(".")[0];
  } catch {
    return endpoint;
  }
}

export function getProviderDisplayName(): string {
  const provider = getProvider();
  if (provider === "openai") {
    return `OpenAI (${process.env.OPENAI_MODEL ?? "gpt-4o"})`;
  }
  if (provider === "azure-openai") {
    return `Azure OpenAI (${process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "gpt-5.1"})`;
  }
  return `Azure Anthropic (${process.env.AZURE_ANTHROPIC_MODEL ?? "claude-sonnet-4-5"})`;
}
