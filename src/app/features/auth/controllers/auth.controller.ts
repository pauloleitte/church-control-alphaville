import { Controller, UseGuards, Request, Post, HttpCode, Body } from '@nestjs/common';
import { InfoDTO } from '../dto/info.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    @HttpCode(200)
    async login(@Request() req: any) {
        return this.authService.login(req.user._doc);
    }

    @Post('auth/info')
    @HttpCode(200)
    async info(@Body() dto: InfoDTO ) {
        return this.authService.info(dto.accessToken);
    }

    @Post('auth/refresh')
    @HttpCode(200)
    async refreshToken(@Body() dto: InfoDTO ) {
        return this.authService.refreshToken(dto.accessToken);
    }
}
