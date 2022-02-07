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
  cuisine: string;
  address: Address;
};

export type EditRestaurantFormData = RestaurantFormData;
