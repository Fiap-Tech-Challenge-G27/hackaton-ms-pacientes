import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { AddressEntity, PatientEntity } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}
  async create(createPatientDto: CreatePatientDto) {
    const passwordEncrypted = await hash(createPatientDto.password, 10);

    console.log(passwordEncrypted);

    const createdPatient = new this.patientModel({
      name: createPatientDto.name,
      email: createPatientDto.email,
      phone: createPatientDto.phone,
      cpf: createPatientDto.cpf,
      password: passwordEncrypted,
      address: {
        street: createPatientDto.address.street,
        number: createPatientDto.address.number,
        city: createPatientDto.address.city,
        state: createPatientDto.address.state,
        zip: createPatientDto.address.zip,
      },
    });

    return await createdPatient.save();
  }

  findAll() {
    const patientes = this.patientModel.find();

    return patientes;
  }

  async findByParam(param: string): Promise<PatientEntity> {
    const patient = await this.patientModel.findOne({
      $or: [{ email: param }, { cpf: param }],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const patienteEntity = new PatientEntity({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      cpf: patient.cpf,
      address: new AddressEntity({
        street: patient.address.street,
        number: patient.address.number,
        city: patient.address.city,
        state: patient.address.state,
        zip: patient.address.zip,
      }),
    });

    patienteEntity.id = patient._id.toString();
    patienteEntity.password = patient.password;

    return patienteEntity;
  }

  update(id: string, updatePatientDto: UpdatePatientDto) {
    console.log(updatePatientDto);
    return `This action updates a #${id} patient`;
  }

  remove(id: string) {
    return `This action removes a #${id} patient`;
  }

  async deleteByCpf(cpf: string): Promise<void> {
    const result = await this.patientModel.deleteMany({ cpf }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Paciente com CPF ${cpf} não encontrado`);
    }
  }
}
