export type PhoneType = 'mobile' | 'home' | 'work';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: PhoneType;
}

export type UserPayload = Omit<User, 'id'>;