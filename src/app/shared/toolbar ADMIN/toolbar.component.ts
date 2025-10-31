import { Component, CUSTOM_ELEMENTS_SCHEMA, type OnInit, inject, type ElementRef, ViewChild, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { JwtHelperService } from "@auth0/angular-jwt"

@Component({
  selector: "app-toolbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./toolbar.component.html",
  styleUrl: "./toolbar.component.css",
  providers: [JwtHelperService],
})
export class ToolbarComponent implements OnInit {
  @ViewChild("dropdownButton", { static: false }) dropdownButton!: ElementRef

  menuItems3 = [{ icon: "mdi:home-outline", route: "/admin" }]

  // Mobile menu items
  mobileMenuItems = [
    { icon: "mdi:account-supervisor", label: "Administradores", route: "/admin/administradores" },
    { icon: "mdi:account-group", label: "Usuarios", route: "/admin/usuarios" },
    { icon: "mdi:office-building", label: "Empresa", route: "/admin/empresa" },
    { icon: "mdi:account-multiple", label: "Clientes", route: "/admin/clientes" },
    { icon: "mdi:shopping", label: "Productos", route: "/admin/productos" },
    { icon: "mdi:clipboard-list", label: "Consultas", route: "/admin/consultas" },
    { icon: "mdi:web", label: "Web", route: "/" }
  ]

  nombreCompleto = ""
  nombreRol = ""
  isDropdownOpen = false
  isMobileMenuOpen = false

  private jwtHelper = inject(JwtHelperService)
  private router = inject(Router)

  ngOnInit(): void {
    const token = localStorage.getItem("token")

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token)
      this.nombreCompleto = `${decoded.nombres} ${decoded.apellidos}`
      this.nombreRol = decoded.nombreRol
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
    // Close user dropdown if open
    if (this.isMobileMenuOpen) {
      this.isDropdownOpen = false
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false
  }

  onDocumentClick(event: Event): void {
    // Close dropdown if clicking outside of it
    if (this.dropdownButton && !this.dropdownButton.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false
    }
  }

  // Close mobile menu on window resize to desktop
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 768) { // md breakpoint
      this.isMobileMenuOpen = false
    }
  }

  logout(): void {
    // Clear authentication data
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken") // if you have refresh token

    // Close dropdown and mobile menu
    this.isDropdownOpen = false
    this.isMobileMenuOpen = false

    // Redirect to login page
    this.router.navigate(["/login"])

    // Optional: Show logout message
    console.log("Sesión cerrada exitosamente")
  }
}