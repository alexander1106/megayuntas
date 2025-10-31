import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  RouterModule,
  Router,
  NavigationEnd,
  ActivatedRoute,
} from "@angular/router";
import { filter } from "rxjs/operators";
import { Subscription } from "rxjs";

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  color: string;
  activeColor: string;
}

@Component({
  selector: "app-sidebar-empresa",
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./sidebar-empresa.component.html",
  styleUrls: ["./sidebar-empresa.component.css"],
})
export class SidebarEmpresaComponent implements OnInit, OnDestroy {
  currentRoute = "";
  private routerSub!: Subscription;

  menuItems: MenuItem[] = [
    {
      label: "Presentación",
      icon: "mdi:book-open-page-variant",
      route: "presentacion",
      color: "bg-teal-500",
      activeColor: "bg-orange-400",
    },
    {
      label: "Misión",
      icon: "mdi:flag",
      route: "mision",
      color: "bg-teal-500",
      activeColor: "bg-orange-400",
    },
    {
      label: "Visión",
      icon: "mdi:eye",
      route: "vision",
      color: "bg-teal-500",
      activeColor: "bg-orange-400",
    },
    {
      label: "Dirección",
      icon: "mdi:map-marker",
      route: "direccion",
      color: "bg-teal-500",
      activeColor: "bg-orange-400",
    },
    {
      label: "Teléfono",
      icon: "mdi:phone",
      route: "telefono",
      color: "bg-teal-500",
      activeColor: "bg-orange-400",
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        this.updateCurrentRoute(navEnd.url);
        this.cdr.detectChanges();
      });

    this.updateCurrentRoute(this.router.url);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  /** 🔁 Navegación absoluta + recarga si está en la misma ruta */
  navigateTo(route: string): void {
    const fullPath = `/admin/empresa/${route}`;
    if (this.router.url === fullPath) {
      // Si ya estás en esa ruta, fuerza navegación para recargar el componente
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/empresa', route]);
      });
    } else {
      this.router.navigate(['/admin/empresa', route]);
    }
  }

  private updateCurrentRoute(url: string): void {
    const parts = url.split("/");
    this.currentRoute = parts[parts.length - 1] || "presentacion";
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  getMobileButtonClass(route: string): string {
    return this.isActive(route) ? "active" : "inactive";
  }
}
