export interface Account {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
  cretedAt: Date;
  lastlogin: Date;
  role_id: number;
}

export interface UserRole extends Account {
  id: number;
  status: string;
}

export interface ReactionLog extends Reaction {
  id: number;
  target_type_id: number;
  target_id: number;
  reaction_id: number;
  account_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reaction extends ReactionTarget {
  id: number;
  emoji: string;
  action: string;
}

export interface ReactionTarget {
  id: number;
  target_name: string;
}
