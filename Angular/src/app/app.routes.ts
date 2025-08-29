import { Routes } from '@angular/router';
import { CloneHome } from './clone-home/clone-home';

import { CloneIn } from './clone-in/clone-in';
import { Login } from './login/login';
import { CloneEdit } from './clone-edit/clone-edit';
import { CloneCreate } from './clone-create/clone-create';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: CloneIn,
        title: 'Netflix India' 
    },
    {
        path: 'login',
        component: Login,
        title: 'Login Page'      
    },
    {
        path: 'home',
        component: CloneHome,
        title: 'Netflix Home',
        canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id',
        component: CloneEdit,
        title: 'Netflix Edit',     
    },
    {
        path: 'add',
        component: CloneCreate,
        title: 'Netflix create',
    },    
];
