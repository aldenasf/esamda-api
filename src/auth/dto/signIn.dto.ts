import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  readonly email: string;

  // in here we don't validate if the password is between 8-32 characters,
  // i do this because this is how it works on most websites for some reason
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
