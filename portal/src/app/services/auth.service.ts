import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth"
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData),
          err => reject(err))
    })
  }

  checkUserAuthState() {
    return this.afAuth.authState;
  }
}
