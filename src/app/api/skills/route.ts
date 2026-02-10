import { NextResponse } from "next/server";
import { loadSkills } from "@/lib/skills";
import { getProvider, getProviderDisplayName } from "@/lib/providers";
import type { SkillsResponse } from "@/types";

export async function GET() {
  const skills = loadSkills();
  const response: SkillsResponse = {
    skills: skills.map(({ id, name, description }) => ({
      id,
      name,
      description,
      content: "",
    })),
    provider: {
      provider: getProvider(),
      displayName: getProviderDisplayName(),
    },
  };

  return NextResponse.json(response);
}
