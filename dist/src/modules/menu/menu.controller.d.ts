import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getMenu(req: any): import("../../interfaces/menu.interface").MenuItem[];
}
