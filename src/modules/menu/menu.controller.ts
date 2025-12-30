/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards , Request} from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }





    @UseGuards(AuthGuard('jwt'))
    @Get()
    getMenu(@Request() req){

        const userRole = req.user.role;

        return this.menuService.getMenuForRole(userRole);

    }




}

