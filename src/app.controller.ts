import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/')
  async test() {
    return 'test ok !';
  }

  @Post('api/auth/register')
  async signUp(@Body() data: any) {
    return (await this.authService.register( data ));
  }

  @Post('auth/login')
  async login(@Body() data: any) {
    return (await this.authService.login( data ));
  }
}
