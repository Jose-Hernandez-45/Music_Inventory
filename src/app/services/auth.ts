import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  deleteUser,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  // Función para registrar un usuario
  async register(nombre: string, email: string, password: string, usuario?: string) {
    let createdUser: User | null = null;
    
    try {
      console.log('📤 Creando usuario en Firebase Auth...');
      
      // 🔹 Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      createdUser = userCredential.user;
      
      console.log('✅ Usuario creado con UID:', createdUser.uid);
      console.log('🗂️ Guardando datos en Firestore...');

      // 🔹 Preparar datos para Firestore
      const userData = {
        uid: createdUser.uid,
        nombre: nombre.trim(),
        usuario: usuario ? usuario.trim() : email.split('@')[0],
        correo: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        activo: true
      };

      // 🔹 Guardar datos en Firestore en la colección 'usuarios'
      const userRef = doc(this.firestore, `usuarios/${createdUser.uid}`);
      await setDoc(userRef, userData, { merge: false });

      console.log('✅ Datos guardados en Firestore exitosamente');
      return createdUser;
      
    } catch (error: any) {
      console.error('❌ Error en el registro:', error);
      
      // 🚨 Si falló Firestore pero se creó el usuario en Auth, eliminarlo
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

  // Función para iniciar sesión
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Función para cerrar sesión
  async logout() {
    try {
      await signOut(this.auth);
      console.log('✅ Sesión cerrada correctamente');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Función para recuperar contraseña
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('✅ Correo de recuperación enviado a:', email);
    } catch (error: any) {
      console.error('❌ Error al enviar correo de recuperación:', error);
      throw error;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Obtener datos del usuario desde Firestore
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