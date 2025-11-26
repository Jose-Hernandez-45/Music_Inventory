import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  deleteUser,
  sendPasswordResetEmail,
  FacebookAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  // 🔹 Registrar usuario con email/contraseña
  async register(nombre: string, email: string, password: string, usuario?: string) {
    let createdUser: User | null = null;
    
    try {
      console.log('📤 Creando usuario en Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      createdUser = userCredential.user;
      
      console.log('✅ Usuario creado con UID:', createdUser.uid);
      console.log('🗂️ Guardando datos en Firestore...');

      const userData = {
        uid: createdUser.uid,
        nombre: nombre.trim(),
        usuario: usuario ? usuario.trim() : email.split('@')[0],
        correo: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        activo: true,
        proveedor: 'email'
      };

      const userRef = doc(this.firestore, `usuarios/${createdUser.uid}`);
      await setDoc(userRef, userData, { merge: false });

      console.log('✅ Datos guardados en Firestore exitosamente');
      return createdUser;
      
    } catch (error: any) {
      console.error('❌ Error en el registro:', error);
      if (createdUser && error.code?.includes('firestore')) {
        console.warn('⚠️ Eliminando usuario de Auth debido a error en Firestore...');
        try {
          await deleteUser(createdUser);
          console.log('✅ Usuario eliminado de Auth');
        } catch (deleteError) {
          console.error('❌ No se pudo eliminar usuario de Auth:', deleteError);
        }
      }
      throw error;
    }
  }

  // 🔹 Login con email/contraseña
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error);
      throw error;
    }
  }

  // 🔹 Login con Facebook
  async loginWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      console.log('✅ Usuario autenticado con Facebook:', user);

      // Guardar datos en Firestore si es nuevo
      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          nombre: user.displayName || '',
          correo: user.email || '',
          imageUrl: user.photoURL || '',
          createdAt: new Date().toISOString(),
          activo: true,
          proveedor: 'facebook'
        });
        console.log('🗂️ Datos guardados en Firestore');
      }

      return user;
    } catch (error) {
      console.error('❌ Error en login con Facebook:', error);
      throw error;
    }
  }

  // 🔹 Logout
  async logout() {
    try {
      await signOut(this.auth);
      console.log('✅ Sesión cerrada correctamente');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }

  // 🔹 Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('✅ Correo de recuperación enviado a:', email);
    } catch (error: any) {
      console.error('❌ Error al enviar correo de recuperación:', error);
      throw error;
    }
  }

  // 🔹 Usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // 🔹 Datos del usuario desde Firestore
  async getUserData(uid: string) {
    try {
      const userRef = doc(this.firestore, `usuarios/${uid}`);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        console.log('No se encontró el usuario en Firestore');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Error al obtener datos del usuario:', error);
      throw error;
    }
  }
}
