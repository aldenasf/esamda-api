import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private uesrModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    // check if user with the same email already exist
    let user = await this.uesrModel.findOne({ email: email });

    // throw an exception if user already exist
    if (user) {
      throw new ConflictException('An account with this email already exists.');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    user = await this.uesrModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // sign token
    const token = this.jwtService.sign({
      id: user._id,
    });

    return { token };
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = signInDto;

    // check if user with the same email exist
    const user = await this.uesrModel.findOne({ email: email });

    // throw an exception if user doesn't exist (invalid email)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // compare password hash
    const comparePassword = await bcrypt.compare(password, user.password);

    // throw an exception if password hash doesn't match (incorrect password)
    if (!comparePassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // sign token
    const token = this.jwtService.sign({
      id: user._id,
    });

    return { token };
  }
}
