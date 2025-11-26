import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-adm-p',
  templateUrl: './adm-p.page.html',
  styleUrls: ['./adm-p.page.scss'],
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
export class AdmPPage implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  searchTerm: string = '';

  constructor(
    private firestore: Firestore,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private zone: NgZone // 👈 Asegura ejecución dentro del contexto Angular
  ) {}

  ngOnInit() {
    this.getProductos();
  }

  getProductos() {
    const productosRef = collection(this.firestore, 'productos');
    
    // 👇 Ejecutamos dentro del contexto Angular para evitar errores
    this.zone.run(() => {
      collectionData(productosRef, { idField: 'id' }).subscribe(data => {
        console.log('Productos cargados:', data);
        this.productos = data;
        this.filtrarProductos();
      });
    });
  }

  filtrarProductos() {
    const term = this.searchTerm.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term)
    );
  }

  editarProducto(productoId: string) {
    this.router.navigate(['/edit-product', productoId]);
  }

  async borrarProducto(productoId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas borrar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            const productoDoc = doc(this.firestore, `productos/${productoId}`);
            await deleteDoc(productoDoc);
            this.getProductos();
          }
        }
      ]
    });

    await alert.present();
  }
}
