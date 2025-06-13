import { CaseData } from '../cases/types';

export interface Service {
  text: string;
  value: string;
  description: string;
}

export interface Showcase extends CaseData {
  coverImage: string;
}

export interface ContactInfo {
  phone: string[];
  wechat: string;
  address?: string;
  description?: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

export interface IndexData {
  services: Service[];
  showcases: Showcase[];
  contactInfo: ContactInfo;
  banners: Banner[];
}