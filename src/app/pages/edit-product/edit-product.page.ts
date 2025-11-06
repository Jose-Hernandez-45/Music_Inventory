import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle
  ]
})
export class EditProductPage implements OnInit {
  productForm: FormGroup = this.fb.group({}); // ✅ inicialización segura
  productId: string = '';
  isLoading = true;

  categorias = [
    'Guitarras', 'Baterias', 'Bajos', 'Teclados/pianos',
    'Percusion', 'Vientos', 'Libros', 'Accesorios', 'Cableado', 'Otros'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
    this.initForm();
    this.loadProduct();
  }

  initForm() {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      categoria: ['', Validators.required],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      marca: [''],
      imageUrl: [''],
      disponible: [true]
    });
  }

  async loadProduct() {
    const loading = await this.loadingController.create({ message: 'Cargando producto...' });
    await loading.present();

    try {
      const productRef = doc(this.firestore, `productos/${this.productId}`);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const data = productSnap.data();
        this.productForm.patchValue(data);
      } else {
        this.showAlert('Error', 'Producto no encontrado');
        this.router.navigate(['/adm-p']);
      }
    } catch (error) {
      console.error('Error al cargar producto:', error);
      this.showAlert('Error', 'No se pudo cargar el producto');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.showAlert('Error', 'Completa todos los campos requeridos');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Guardando cambios...' });
    await loading.present();

    try {
      const productRef = doc(this.firestore, `productos/${this.productId}`);
      await updateDoc(productRef, {
        ...this.productForm.value,
        precio: parseFloat(this.productForm.value.precio),
        stock: parseInt(this.productForm.value.stock),
        updatedAt: serverTimestamp()
      });

      this.showAlert('Éxito', 'Producto actualizado');
      this.router.navigate(['/adm-p']);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      this.showAlert('Error', 'No se pudo guardar el producto');
    } finally {
      await loading.dismiss();
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
