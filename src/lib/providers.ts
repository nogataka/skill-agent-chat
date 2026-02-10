import { createAzure } from "@ai-sdk/azure";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

export type LLMProvider = "azure-openai" | "azure-anthropic";

export function getProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "azure-openai";
  if (provider !== "azure-openai" && provider !== "azure-anthropic") {
    throw new Error(
      `Invalid LLM_PROVIDER: ${provider}. Use "azure-openai" or "azure-anthropic".`
    );
  }
  return provider;
}

export function getModel(): LanguageModel {
  const provider = getProvider();

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
  if (provider === "azure-openai") {
    return `Azure OpenAI (${process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "gpt-5.1"})`;
  }
  return `Azure Anthropic (${process.env.AZURE_ANTHROPIC_MODEL ?? "claude-sonnet-4-5"})`;
}
