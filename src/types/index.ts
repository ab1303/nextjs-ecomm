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
