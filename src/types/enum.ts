enum RoleVariant {
  'user',
  'admin',
}

export type UserRole = keyof typeof RoleVariant;
