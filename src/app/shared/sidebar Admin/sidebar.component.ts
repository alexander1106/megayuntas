import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  menuItems = [
    { label: 'Administradores', icon: 'mdi:account-cog', route: 'administradores' },
    { label: 'Usuarios',       icon: 'mdi:account-multiple', route: 'usuarios' },
    { label: 'Empresas',       icon: 'mdi:domain', route: 'empresa' },
    { label: 'Clientes',       icon: 'mdi:account', route: 'clientes' },
    { label: 'Productos',      icon: 'mdi:cube-outline', route: 'productos' },
    { label: 'Consultas',      icon: 'mdi:clipboard-text', route: 'consultas' },
  ];
  menuItems2 = [
    { label2: 'Web',      icon: 'mdi:web', route: '/' },
  ];

}
