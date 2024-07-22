import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ _id: false })
export class Address {
  @Prop()
  street: string;
  @Prop()
  number: number;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop()
  zip: string;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, type: AddressSchema })
  address: Address;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
