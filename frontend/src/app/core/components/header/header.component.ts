import {Component, Input} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  title = 'Inicio de Sesion';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log('logeado:',this.isLoggedIn)
      this.title = this.isLoggedIn ? 'Javier Tecpan' : 'inicio de sesion';
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    console.log('logout');
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
