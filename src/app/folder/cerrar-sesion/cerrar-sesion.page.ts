import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { AlertController, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cerrar-sesion',
  templateUrl: './cerrar-sesion.page.html',
  styleUrls: ['./cerrar-sesion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner
  ]
})
export class CerrarSesionPage implements OnInit {

  constructor(
    private auth: Auth,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.logout();
  }

  async logout() {
    try {
      await signOut(this.auth);

      const alert = await this.alertController.create({
        header: 'Sesión cerrada',
        message: 'Has cerrado sesión correctamente.',
        buttons: ['OK']
      });
      await alert.present();

      // Redirigir al login
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo cerrar sesión. Intenta nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
