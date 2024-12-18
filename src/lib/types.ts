export type Order = {
  time: Date;
  lname: string | null;
  fname: string | null;
  phone: string | null;
  orderId: string;
  type: string;
};

export type Type = {
  id: string;
  name: string;
};
