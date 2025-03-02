export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAchievementDTO {
  name: string;
  description: string;
  points: number;
  image_url?: string;
}
