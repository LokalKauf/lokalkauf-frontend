export interface TraderProfile {
  id?: string;
  businessname: string;
  ownerFirstname: string;
  ownerLastname: string;
  postcode: string;
  city: string;
  street: string;
  number: number;
  description: string;
  pickup: boolean;
  delivery: boolean;
  email: string;
  telephone: string;
  defaultImagePath?: string;
  storeEmail: string;
  homepage: string;
  status: TraderProfileStatus;
  soMeShare: boolean;
  licence?: string;
  confirmedLocation?: number[];
  storeType: {
    gastronomie: boolean;
    lebensmittel: boolean;
    fashion: boolean;
    buchhandlung: boolean;
    homedecor: boolean;
    blumengarten: boolean;
    handwerk: boolean;
    sonstiges: boolean;
  };
  currentDistance?: number;
  onlineshop?: string;
}

export enum TraderProfileStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERFIED',
  PUBLIC = 'PUBLIC',
  DELETED = 'DELETED',
}
