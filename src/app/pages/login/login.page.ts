import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonList
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonList,
    RouterLink,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage {
  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.usuario === 'admin' && this.contrasena === '1234') {
      // Navegar al home
      this.router.navigate(['./home']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}
