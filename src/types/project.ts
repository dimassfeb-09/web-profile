import { Tech } from "./tech";

export interface Project {
    id: number;
    title: string;
    description: string;
    type: string;
    github_url: string;
    playstoreUrl?: string;
    demo_url: string;
    image_url: string;
    portfolio_techs: Tech[];
    created_at: string;
  }