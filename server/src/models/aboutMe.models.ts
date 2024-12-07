export interface Address {
  id: number;
  city: string;
  department: string;
  country: string;
}

export interface AboutMe extends OnGoingFormation {
  id: number;
  address_id: number;
  linkedIn_url: string;
  introduction_text: string;
  github_url: string;
  ongoing_formation_id: number;
}

export interface Formation extends Address {
  id: number;
  title: string;
  description: string;
  level: string;
  start_date: Date;
  end_date: Date;
  address_id: number;
}

export interface OnGoingFormation extends Address {
  id: number;
  name: string;
  description: string;
  rythme: string;
  sector: string;
  duration: number;
  address_id: number;
}

export interface Experience extends Address {
  id: number;
  title: string;
  task: string;
  skills: string;
  address_id: number;
}
