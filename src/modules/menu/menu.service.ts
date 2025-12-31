
import { Injectable } from '@nestjs/common';
import { MenuItem } from 'src/interfaces/menu.interface';
import { MASTER_MENU } from './config/menu.config';

@Injectable()
export class MenuService {
    getMenuForRole(userRole: string): MenuItem[] {
        return MASTER_MENU.filter(item => {
            if (!item.roles || item.roles.length === 0) {
                return true;
            }
            return item.roles?.includes(userRole)
        })
    }
}
