import fs from "fs";
import path from "path";
import type { Skill } from "@/types";

const SKILLS_DIR = path.join(process.cwd(), "skills");

function parseFrontmatter(content: string): {
  name: string;
  description: string;
  body: string;
} {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return { name: "", description: "", body: content };
  }

  const frontmatter = match[1];
  const body = match[2];

  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

  return {
    name: nameMatch?.[1]?.trim() ?? "",
    description: descMatch?.[1]?.trim() ?? "",
    body: body.trim(),
  };
}

export function loadSkills(): Skill[] {
  const skills: Skill[] = [];

  // default.md
  const defaultPath = path.join(SKILLS_DIR, "default.md");
  if (fs.existsSync(defaultPath)) {
    const content = fs.readFileSync(defaultPath, "utf-8");
    const { name, description, body } = parseFrontmatter(content);
    skills.push({
      id: "default",
      name: name || "デフォルトアシスタント",
      description: description || "汎用AIアシスタント",
      content: body,
    });
  }

  // サブディレクトリ内の SKILL.md
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(SKILLS_DIR, entry.name, "SKILL.md");
    if (!fs.existsSync(skillPath)) continue;

    const content = fs.readFileSync(skillPath, "utf-8");
    const { name, description, body } = parseFrontmatter(content);
    skills.push({
      id: entry.name,
      name: name || entry.name,
      description: description || "",
      content: body,
    });
  }

  return skills;
}

export function getSkillById(id: string): Skill | undefined {
  const skills = loadSkills();
  return skills.find((s) => s.id === id);
}
