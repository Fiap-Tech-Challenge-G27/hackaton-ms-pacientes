export class AddressEntity {
  street: string;
  number: number;
  city: string;
  state: string;
  zip: string;

  constructor(partial: Partial<AddressEntity>) {
    Object.assign(this, partial);
  }
}
export class PatientEntity {
  id?: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  password?: string;
  address: AddressEntity;

  constructor(partial: Partial<PatientEntity>) {
    Object.assign(this, partial);
  }
}
