enum RoleVariant {
  'user',
  'admin',
}

export type UserRole = keyof typeof RoleVariant;

export enum CuisineType {
  Continental = 'Continental',
  Chinese = 'Chinese',
  Egyptian = 'Egyptian',
  Filipino = 'Filipino',
  Indian = 'Indian',
  Italian = 'Italian',
  Korean = 'Korean',
  Lebanese = 'Lebanese',
  Pakistani = 'Pakistani',
  Thai = 'Thai',
  Vietnemese = 'Vietnemese',
  Western = 'Western',
}

export interface CardData {
  image: string;
  title: string;
  url: string;
}

export enum Countries {
  Australia = 'AU (+61)',
  NewZealand = 'NZ (+64)',
  Singapore = 'SG (+65)',
}
