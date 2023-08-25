import { Controller, Get, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  @UseGuards(AuthGuard())
  test() {
    return this.testService.test();
  }
}
