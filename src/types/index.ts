export type Notify = {
  error?: string;
  success?: string;
};

export type ModalItem = {
  data: unknown;
  id: number;
  title: string;
  type: string;
};

export type Photo = {
  filename: string;
  url: string;
};

export type Address = {
  addressLine: string;
  street_address: string;
  suburb: string;
  postcode: string;
  state: string;
};

export type RestaurantFormData = {
  restaurantName: string;
  imageUrl: string;
  thumbnailUrl: string;
  cuisine: string;
  contact: string;
  address: Address;
};

export type ProfileData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  country: string;
  active: boolean;
};

export type EditRestaurantFormData = RestaurantFormData;

export type CategoryFormData = {
  categoryName: string;
};
