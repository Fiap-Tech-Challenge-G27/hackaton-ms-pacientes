import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientsService } from '../patient/patients.service';
import { PatientEntity } from '../patient/entities/patient.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationDto } from './dto/authentication.dto';

@Injectable()
export class AuthService {
  constructor(
    private patientsService: PatientsService,
    private jwtService: JwtService,
  ) {}
  async validatePatient(
    username: string,
    password: string,
  ): Promise<PatientEntity> {
    const patient = await this.patientsService.findByParam(username);

    if (!patient && patient.password !== password) {
      throw new BadRequestException('Invalid user');
    }

    delete patient.password;

    return patient;
  }

  async login(authenticationDto: AuthenticationDto) {
    const patiente = await this.validatePatient(
      authenticationDto.username,
      authenticationDto.password,
    );

    return {
      access_token: this.jwtService.sign({ ...patiente }),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
}
