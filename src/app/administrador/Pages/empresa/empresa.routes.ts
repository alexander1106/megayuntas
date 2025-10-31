import { Routes } from "@angular/router";
import { EmpresaComponent } from "./empresa.component";

export const EMPRESA_ROUTES: Routes = [
  {
    path: "",
    component: EmpresaComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "presentacion"
      },
      {
        path: "presentacion",
        loadComponent: () => import("./components/presentacion/presentacion.component").then(m => m.PresentacionComponent),
      },
      {
        path: "mision",
        loadComponent: () => import("./components/mision/mision.component").then(m => m.MisionComponent),
      },
      {
        path: "vision",
        loadComponent: () => import("./components/vision/vision.component").then(m => m.VisionComponent),
      },
      {
        path: "direccion",
        loadComponent: () => import("./components/direccion/direccion.component").then(m => m.DireccionComponent),
      },
      {
        path: "telefono",
        loadComponent: () => import("./components/telefono/telefono.component").then(m => m.TelefonoComponent),
      },
    ]
  }
]
