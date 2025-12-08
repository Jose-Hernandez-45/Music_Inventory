import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton,
  IonButtons, IonMenuButton, IonIcon, IonText, IonList, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';

// 🔹 Firebase Firestore
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
    IonButton,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonText,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class AdministracionPage implements OnInit {
  // 🔹 Variables que se muestran en el HTML
  usuariosActivos = 0;
  totalUsuarios = 0;
  totalProductos = 0;

  paisesActivos = [
    { nombre: 'México', usuarios: 1 },
    { nombre: 'Colombia', usuarios: 0 },
    { nombre: 'Argentina', usuarios: 0 }
  ];

  private firestore = inject(Firestore);

  ngOnInit() {
    // 🔹 Productos en inventario
    const productosRef = collection(this.firestore, 'productos');
    collectionData(productosRef).subscribe(productos => {
      this.totalProductos = productos.length;
    });

    // 🔹 Usuarios registrados
    const usuariosRef = collection(this.firestore, 'usuarios');
    collectionData(usuariosRef).subscribe(usuarios => {
      this.totalUsuarios = usuarios.length;

      // Ejemplo: usuarios con campo activo:true
      this.usuariosActivos = usuarios.filter((u: any) => u.activo === true).length;
    });

    // 🔹 Países principales (simulado)
    // Aquí podrías conectar con Analytics o tu BD para calcular usuarios por país
    this.paisesActivos = [
      { nombre: 'México', usuarios: this.usuariosActivos },
      { nombre: 'Colombia', usuarios: 0 },
      { nombre: 'Argentina', usuarios: 0 }
    ];
  }
}
