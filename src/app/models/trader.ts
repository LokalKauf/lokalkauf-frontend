// TODO This thing should be renamed or deleted, because there is the traderProfile.ts
export interface Trader {
  id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  products: string[];
  currentDistance?: number;
}
