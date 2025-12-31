import { MenuSection } from "src/interfaces/menu.interface";

export const MASTER_MENU: MenuSection[] = [
    {
        title: 'PRINCIPAL',
        items: [
            {
                label: 'Dashboard',
                icon: 'fa-solid fa-house',
                path: '/dashboard/home',
                roles: ['ADMIN', 'Tecnico', 'Vendedor']
            }
        ]
    },
    {
        title: 'ADMINISTRACIÓN',
        items: [
            {
                label: 'Usuarios',
                icon: 'fa-solid fa-users',
                path: '/dashboard/users',
                roles: ['ADMIN']
            },
            {
                label: 'Inventario',
                icon: 'fa-solid fa-box-open',
                path: '/dashboard/inventory',
                roles: ['Admin', 'Técnico'],
                children: [
                    { label: 'Ver Stock', icon: 'fa-solid fa-list', path: '/dashboard/inventory/list' },
                    { label: 'Entradas/Salidas', icon: 'fa-solid fa-arrow-right-arrow-left', path: '/dashboard/inventory/movements' }
                ]
            }
        ]
    }
];