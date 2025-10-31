import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-pagina-web',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './pagina-web.component.html',
  styleUrl: './pagina-web.component.css'
})
export class PaginaWebComponent {

}
