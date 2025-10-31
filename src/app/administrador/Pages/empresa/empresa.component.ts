import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectorRef,
  OnDestroy,
  OnInit
} from "@angular/core";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { SidebarEmpresaComponent } from "../../../shared/sidebar-empresa/sidebar-empresa.component";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-empresa",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarEmpresaComponent],
  templateUrl: "./empresa.component.html",
  styleUrl: "./empresa.component.css",
})
export class EmpresaComponent implements OnInit, OnDestroy {
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  onRouteActivate(): void {}
  onRouteDeactivate(): void {}
}
