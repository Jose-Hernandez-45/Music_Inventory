import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
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
  IonCheckbox,
  IonModal,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

// Firebase imports
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, RouterLink, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton, IonButtons, IonMenuButton,
    IonCheckbox, IonModal, CommonModule, FormsModule
  ]
})
export class RegisterPage implements OnInit {

  nombre = '';
  email = '';
  usuario = '';
  contrasena = '';
  contrasena2 = '';
  acceptedPolicies = false;
  errorMessage = '';

  auth = inject(Auth);
  firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);

  @ViewChild('policiesModal', { static: false }) policiesModal!: IonModal;
  @ViewChild('errorModal', { static: false }) errorModal!: IonModal;

  constructor(private router: Router) {}

  ngOnInit() {}

  // Función para traducir errores de Firebase
  private firebaseErrorMessage(code: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/operation-not-allowed': 'El registro con correo electrónico no está habilitado',
      'auth/weak-password': 'La contraseña es demasiado débil',
      'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet'
    };
    return errorMessages[code] || 'Ocurrió un error inesperado. Intenta de nuevo.';
  }

  // Opción 1: Modal control con ChangeDetectorRef (para usar tus modales HTML)
  async showErrorModal(message: string) {
    this.errorMessage = message;
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    // Pequeño delay para asegurar que el mensaje se renderice
    await new Promise(resolve => setTimeout(resolve, 50));
    
    if (this.errorModal) {
      return await this.errorModal.present();
    }
  }

  closeErrorModal() {
    return this.errorModal?.dismiss();
  }

  async showPoliciesModal() {
    if (!this.policiesModal) return;
    return await this.policiesModal.present();
  }

  closePoliciesModal() {
    return this.policiesModal?.dismiss();
  }

  async acceptPolicies() {
    this.acceptedPolicies = true;
    await this.closePoliciesModal();
    await this.onRegister();
  }

  // Opción 2: Usar AlertController de Ionic (MÁS RECOMENDADO)
  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Aceptar'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  // Mostrar loading
  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  async onRegister() {

    // Validaciones básicas
    if (!this.nombre || !this.email || !this.usuario || !this.contrasena || !this.contrasena2) {
      await this.showErrorAlert('Por favor completa todos los campos');
      return;
    }

    if (this.contrasena.length < 6) {
      await this.showErrorAlert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.contrasena !== this.contrasena2) {
      await this.showErrorAlert('Las contraseñas no coinciden');
      return;
    }

    if (!this.acceptedPolicies) {
      await this.showPoliciesModal();
      return;
    }

    const loading = await this.showLoading();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        this.email, 
        this.contrasena
      );
      const user = userCredential.user;

      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      await setDoc(userRef, {
        uid: user.uid,
        nombre: this.nombre,
        usuario: this.usuario,
        correo: this.email,
        createdAt: new Date().toISOString()
      });

      await loading.dismiss();
      
      await this.showSuccessAlert('Usuario registrado exitosamente');
      this.router.navigate(['/login']);
      
    } catch (error: any) {
      console.error('❌ Error al registrar usuario:', error);
      await loading.dismiss();
      
      // Usar AlertController en lugar del modal
      await this.showErrorAlert(this.firebaseErrorMessage(error.code));
    }
  }
}