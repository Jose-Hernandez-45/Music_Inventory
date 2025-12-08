import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonSpinner,
  IonIcon,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

// 🔹 Importar Analytics
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
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
    IonCardTitle,
    IonSpinner,
    IonIcon
  ]
})
export class AddProductPage implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;

  categorias = [
    'Guitarras',
    'Baterias',
    'Bajos',
    'Teclados/pianos',
    'Percusion',
    'Vientos',
    'Libros',
    'Accesorios',
    'Cableado',
    'Otros'
  ];

  // 🔹 Inyectar Analytics
  private analytics = inject(Analytics);

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      marca: [''],
      imageUrl: [''], // URL de imagen (opcional)
      disponible: [true]
    });
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      await this.showAlert('Error', 'Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Agregando producto...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isSubmitting = true;

    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const productData = {
        ...this.productForm.value,
        precio: parseFloat(this.productForm.value.precio),
        stock: parseInt(this.productForm.value.stock),
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const productsCollection = collection(this.firestore, 'productos');
      await addDoc(productsCollection, productData);

      // 🔹 Registrar evento en Analytics
      logEvent(this.analytics, 'add_product', {
        nombre: productData.nombre,
        precio: productData.precio,
        categoria: productData.categoria,
        stock: productData.stock,
        marca: productData.marca || 'Sin marca'
      });

      await loading.dismiss();
      await this.showAlert('Éxito', 'Producto agregado correctamente');

      this.productForm.reset({ disponible: true });
      this.router.navigate(['/adm-p']);

    } catch (error) {
      await loading.dismiss();
      console.error('Error al agregar producto:', error);
      await this.showAlert('Error', 'No se pudo agregar el producto. Intenta nuevamente.');
    } finally {
      this.isSubmitting = false;
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

  cancelar() {
    this.router.navigate(['/adm-p']);
  }
}
