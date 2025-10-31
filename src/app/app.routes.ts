import { Routes } from '@angular/router';
import { PaginaWebComponent } from './pagina-web/pagina-web.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { adminGuard } from './guards/admin.guard';
import { filter } from 'rxjs/operators';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
  // ——— PÁGINA WEB —————————————————————————————————————
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: '',
    component: PaginaWebComponent,
    children: [
      { path: 'inicio',
        loadComponent: () =>
          import('./pagina-web/PAGE/inicio/inicio.component')
            .then(m => m.InicioComponent)
      },
      { path: 'nosotros',
        loadComponent: () =>
          import('./pagina-web/PAGE/nosotros/nosotros.component')
            .then(m => m.NosotrosComponent)
      },
      { path: 'productos',
        loadComponent: () =>
          import('./pagina-web/PAGE/productos/productos.component')
            .then(m => m.ProductosComponent)
      },
      {
        path: 'vistaproducto/:id',
        loadComponent: () =>
          import('./pagina-web/PAGE/productos/vistaproducto/vistaproducto.component')
            .then(m => m.VistaproductoComponent)
      },
      { path: 'consultas',
        loadComponent: () =>
          import('./pagina-web/PAGE/consultas/consultas.component')
            .then(m => m.ConsultasComponent)
      },
      { path: 'vistaconsulta/:id',
        loadComponent: () =>
          import('./pagina-web/PAGE/consultas/vistaconsulta/vistaconsulta.component')
            .then(m => m.VistaconsultaComponent)
      },
      { path: 'clientes',
        loadComponent: () =>
          import('./pagina-web/PAGE/clientes/clientes.component')
            .then(m => m.ClientesComponent)
      },
    ]
  },

  // ——— LOGIN —————————————————————————————————————————
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent)
  },
 {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
   {
    path: 'reset-password',
    loadComponent: () =>
      import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)
  },
  // ——— ADMINISTRACIÓN ——————————————————————————————
  {
    path: 'admin',
    component: AdministradorComponent,
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],   // layout con toolbar + sidebar
    children: [
      // ruta por defecto
      { path: '', redirectTo: 'admin', pathMatch: 'full' },

      // sub-rutas anidadas
      {
        path: 'administradores',
        loadComponent: () =>
          import('./administrador/Pages/administradores/administradores.component')
            .then(m => m.AdministradoresComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./administrador/Pages/usuarios/usuarios.component')
            .then(m => m.UsuariosComponent)
      },
      {
        path: "empresa",
        loadChildren: () => import("./administrador/Pages/empresa/empresa.routes").then((m) => m.EMPRESA_ROUTES),
      },

      {
        path: 'clientes',
        loadComponent: () =>
          import('./administrador/Pages/clientes/clientes.component')
            .then(m => m.ClientesComponent)
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./administrador/Pages/productos/productos.component')
            .then(m => m.ProductosComponent)
      },
      {
        path: 'consultas',
        loadComponent: () =>
          import('./administrador/Pages/consultas/consultas.component')
            .then(m => m.ConsultasComponent)
      },
    ]
  },

  // ——— comodín ——————————————————————————————————————————
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
];
