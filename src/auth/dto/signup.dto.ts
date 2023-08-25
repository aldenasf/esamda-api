import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  readonly email: string;

  @IsString()
  @Length(8, 32)
  readonly password: string;
}
