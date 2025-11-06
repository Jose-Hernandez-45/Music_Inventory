import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, home, pricetag, bagAdd, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Iniciar Sesión', url: './login', icon: 'person' },
    { title: 'Inicio', url: './home', icon: 'home' },
    { title: 'Productos', url: '/folder/Productos', icon: 'pricetag' },
    { title: 'Favoritos', url: '/folder/Favoritos', icon: 'heart' },
    { title: 'Administrador de productos', url: './adm-p', icon: 'bag-add' },
    { title: 'Cerrar sesión', url: '/folder/CerrarSesion', color: 'danger', icon: 'warning' },
  ];

  public userName: string = 'Usuario';

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    addIcons({ mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp });
  }

  ngOnInit() {
    // Escuchar cambios en la autenticación
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        try {
          // Obtener el documento del usuario desde Firestore
          // Ajusta 'users' por el nombre de tu colección
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Ajusta 'nombre' o 'name' por el campo que uses en tu BD
            this.userName = userData['nombre'] || userData['name'] || user.displayName || user.email?.split('@')[0] || 'Usuario';
          } else if (user.displayName) {
            this.userName = user.displayName;
          } else if (user.email) {
            // Si no hay documento, usar el email sin el dominio
            this.userName = user.email.split('@')[0];
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          // Fallback al displayName o email
          this.userName = user.displayName || user.email?.split('@')[0] || 'Usuario';
        }
      } else {
        this.userName = 'Usuario';
      }
    });
  }
}
