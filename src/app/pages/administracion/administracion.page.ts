import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router';
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
  IonList,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
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
      IonList,
      RouterLink
    ]
})
export class AdministracionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
