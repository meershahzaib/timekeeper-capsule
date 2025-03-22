
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export type Reward = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  reward: string;
  achievement_type: string;
  points: number;
  claimed: boolean;
  claimable?: boolean;
  progress?: number;
  maxProgress?: number;
};

export type UserStats = {
  total_points: number;
  capsules_created: number;
  memories_stored: number;
  days_preserved: number;
  last_accumulation_time?: string;
  accumulated_fil?: number;
};

export type Achievement = {
  id: string;
  achievement_name: string;
  achievement_type: string;
  description: string;
  points: number;
  earned_at: string;
  user_id: string;
  created_at: string;
};

export type RewardLevel = {
  name: string;
  threshold: number;
  multiplier: number;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};
