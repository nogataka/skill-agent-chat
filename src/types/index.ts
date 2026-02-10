export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
}

export interface ProviderInfo {
  provider: string;
  displayName: string;
}

export interface SkillsResponse {
  skills: Skill[];
  provider: ProviderInfo;
}

export interface Conversation {
  id: string;
  skillId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
