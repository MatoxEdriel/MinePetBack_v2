import { MenuSection } from "src/interfaces/menu.interface";

export const MASTER_MENU: MenuSection[] = [
    {
        title: 'PRINCIPAL',
        items: [
            {
                label: 'Dashboard',
                icon: 'fa-solid fa-house',
                path: '/dashboard/home',
                roles: ['ADMIN', 'Dueño', 'Veterinario']
            }


        ],

    },

    {
        title: 'Servicios',
        items: [
            {
                label: 'Registrar Consulta',
                icon: 'fa-solid fa-circle-plus',
                path: '/dashboard/services',
                roles: ['ADMIN', 'Dueño', 'Veterinario']
            }


        ],

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
                roles: ['ADMIN', 'Veterinario'],
                children: [
                    { label: 'Ver Stock', icon: 'fa-solid fa-list', path: '/dashboard/inventory/list' },
                    { label: 'Entradas/Salidas', icon: 'fa-solid fa-arrow-right-arrow-left', path: '/dashboard/inventory/movements' }
                ]
            }
        ]
    }
];