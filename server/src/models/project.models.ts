export interface Project extends ProjectTechnology {
  id: number;
  title: string;
  description: string;
  project_status_id: number;
  production_url: string;
  github_url: string;
  createdAt: Date;
}

export interface ProjectStatus {
  id: number;
  status_name: string;
}

export interface ProjectTechnology extends Technology {
  project_id: number;
  technology_id: number;
}

export interface Technology extends Category {
  id: number;
  name: string;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
}
