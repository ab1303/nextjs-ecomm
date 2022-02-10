enum RoleVariant {
  'user',
  'admin',
}

export type UserRole = keyof typeof RoleVariant;

export interface CardData {
  image: string;
  title: string;
  url: string;
}
