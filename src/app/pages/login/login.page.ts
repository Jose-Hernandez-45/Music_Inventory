import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonText,
  IonCheckbox,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { musicalNotes, logoFacebook } from 'ionicons/icons';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton, IonButtons, 
    IonMenuButton, IonIcon, IonText, IonCheckbox, RouterLink,
    CommonModule, FormsModule
  ]
})
export class LoginPage implements OnInit {

  email = '';
  contrasena = '';
  aceptaPoliticas = false; // 👈 nuevo campo

  private authService = inject(AuthService);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private router = inject(Router);

  constructor() {
    addIcons({ musicalNotes, logoFacebook });
  }

  ngOnInit() {
    this.checkExistingSession();
  }

  // Verificar si ya hay una sesión activa
  async checkExistingSession() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.router.navigate(['/home']);
    }
  }

  // Traducir errores de Firebase a español
  private firebaseErrorMessage(code: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
      'auth/wrong-password': 'La contraseña es incorrecta',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet',
      'auth/invalid-credential': 'Correo o contraseña incorrectos',
      'auth/missing-password': 'Debes ingresar una contraseña'
    };
    
    return errorMessages[code] || 'Error al iniciar sesión. Verifica tus credenciales.';
  }

  // Mostrar alerta de error
  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: '⚠️ Error',
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  // Mostrar alerta de éxito
  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: '✅ Éxito',
      message: message,
      buttons: ['Continuar']
    });
    await alert.present();
  }

  // Mostrar loading spinner
  async showLoading(message: string = 'Iniciando sesión...') {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  // Recuperar contraseña
  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      message: 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'correo@ejemplo.com',
          value: this.email
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (!data.email) {
              this.showErrorAlert('Por favor ingresa tu correo electrónico');
              return false;
            }

            const loading = await this.showLoading('Enviando correo...');
            
            try {
              await this.authService.resetPassword(data.email);
              await loading.dismiss();
              await this.showSuccessAlert(
                'Se ha enviado un correo con instrucciones para restablecer tu contraseña'
              );
            } catch (error: any) {
              await loading.dismiss();
              await this.showErrorAlert(this.firebaseErrorMessage(error.code));
            }
            
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // 🔹 Login con email/contraseña
  async onLogin() {

    // Validación: aceptar políticas
    if (!this.aceptaPoliticas) {
      await this.showErrorAlert('Debes aceptar las políticas de privacidad para iniciar sesión.');
      return;
    }

    // Validación: Campos vacíos
    if (!this.email.trim() || !this.contrasena) {
      await this.showErrorAlert('Por favor completa todos los campos');
      return;
    }

    // Validación: Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.showErrorAlert('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validación: Longitud de contraseña
    if (this.contrasena.length < 6) {
      await this.showErrorAlert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const loading = await this.showLoading();

    try {
      
      const user = await this.authService.login(this.email, this.contrasena);
      
      await loading.dismiss();
      
      try {
        const userData = await this.authService.getUserData(user.uid);
      } catch (error) {
        console.warn('No se pudieron obtener datos adicionales del usuario');
      }
      
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error);
      await loading.dismiss();
      const errorMsg = this.firebaseErrorMessage(error.code);
      await this.showErrorAlert(errorMsg);
    }
  }

  // 🔹 Login con Facebook
  async onLoginWithFacebook() {
    const loading = await this.showLoading('Conectando con Facebook...');
    try {
      const user = await this.authService.loginWithFacebook();
      await loading.dismiss();
      this.router.navigate(['/home']);
    } catch (error: any) {
      await loading.dismiss();
      console.error('❌ Error en login con Facebook:', error);
      await this.showErrorAlert('No se pudo iniciar sesión con Facebook');
    }
  }
}
