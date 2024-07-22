import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
