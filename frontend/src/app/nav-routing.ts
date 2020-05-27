import { Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';

export interface NavRoute extends Route {
    path?: string;
    icon?: string;
    group?: string;
    groupedNavRoutes?: NavRoute[];
}

export const sideNavPath = 'manage';

export const navRoutes: NavRoute[] = [
    {
        data: {
            title: 'Inicio',
            shouldReuse: false
        },
        icon: 'home',
        path: 'home',
        loadChildren: () =>
            import('./pages/home-page/home-page.module').then(
                m => m.HomePageModule,
            ),
    },
    {
        data: {
            title: 'Comprobante de ventas',
            shouldReuse: false
        },
        icon: 'add',
        path: 'sales',
        loadChildren: () =>
            import('./pages/sales-list-page/sales-list-page.module').then(
                m => m.SalesListPageModule,
            ),

    },
    {
        data: {
            title: 'Comprobante de compras',
            shouldReuse: false
        },
        icon: 'add',
        path: 'purchases',
        loadChildren: () =>
            import('./pages/purchases-list-page/purchases-list-page.module').then(
                m => m.PurchasesListPageModule,
            ),
    },
    {
        data: {
            title: 'Mantenimiento de empresas',
            shouldReuse: false
        },
        icon: 'add',
        path: 'companies',
        loadChildren: () =>
            import('./pages/manage-companies/manage-companies.module').then(
                m => m.ManageCompaniesModule,
            ),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];

@Injectable({
    providedIn: 'root',
})
export class NavRouteService {
    navRoute: Route;
    navRoutes: NavRoute[];

    constructor(router: Router) {
        this.navRoute = router.config.find(route => route.path === sideNavPath);
        this.navRoutes = this.navRoute.children
            .filter(route => route.data && route.data.title)
            .reduce((groupedList: NavRoute[], route: NavRoute) => {
                if (route.group) {
                    const group: NavRoute = groupedList.find(navRoute => {
                        return (
                            navRoute.group === route.group &&
                            navRoute.groupedNavRoutes !== undefined
                        );
                    });
                    if (group) {
                        group.groupedNavRoutes.push(route);
                    } else {
                        groupedList.push({
                            group: route.group,
                            groupedNavRoutes: [route],
                        });
                    }
                } else {
                    groupedList.push(route);
                }
                return groupedList;
            }, []);
    }

    public getNavRoutes(): NavRoute[] {
        return this.navRoutes;
    }
}
