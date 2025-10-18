import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonMenuButton, IonCheckbox, IonModal } from '@ionic/angular/standalone';
import { Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, RouterLink, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonMenuButton, IonCheckbox, IonModal, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  nombre: string = '';
  email: string = '';
  usuario: string = '';
  contrasena: string = '';
  contrasena2: string = '';
  acceptedPolicies: boolean = false;
  @ViewChild('policiesModal', { static: false }) policiesModal!: ElementRef<HTMLIonModalElement>;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onRegister() {
    // Validaciones simples
    if (!this.nombre || !this.email || !this.usuario || !this.contrasena || !this.contrasena2) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (this.contrasena !== this.contrasena2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!this.acceptedPolicies) {
      this.showPoliciesModal();
      return;
    }

    // Aquí podrías llamar a un servicio para crear el usuario. Por ahora simulamos éxito.
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    this.router.navigate(['/login']);
  }

  async showPoliciesModal() {
    if (!this.policiesModal) return;
    await this.policiesModal.nativeElement.present();
    await this.policiesModal.nativeElement.onDidDismiss();
  }

  closePoliciesModal() {
    if (!this.policiesModal) return;
    this.policiesModal.nativeElement.dismiss();
  }

  acceptPolicies() {
    this.acceptedPolicies = true;
    this.closePoliciesModal();
  }

}
