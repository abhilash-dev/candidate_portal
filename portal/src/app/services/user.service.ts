import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore"
import { Observable, combineLatest } from "rxjs";
import { map, flatMap } from "rxjs/operators"
import { User } from "../models/user"
import { Employment } from "../models/employment"
import { EmploymentEntry } from '../models/employment-entry';



interface DocWithId {
  id?: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  user: Observable<User>;
  employment_history: Observable<Employment[]>;

  constructor(private firestore: AngularFirestore) {
    this.userCollection = this.firestore.collection('user');
  }

  getUsers(): Observable<User[]> {
    this.users = this.getDocumentsWithSubcollection<User>();

    return this.users;
  }

  getUser(id: string): Observable<User> {
    return this.getDocumentWithSubcollection<User>(id);
  }

  updateUser(user: User) {
    const { employment_history, ...data } = user
    const userDoc = this.firestore.doc(`user/${user.id}`);
    userDoc.update(data);
    employment_history.map(e => {
      let id = e.id
      if (id) {
        userDoc.collection(`employment`).doc(id).update(e);
      } else {
        let employment: Employment = { ...e }
        employment.user_id = user.id
        console.log(employment)
        this.firestore.collection(`user/${user.id}/employment`).add(employment);
      }
    })
  }

  deleteUser(user: User) {
    const { employment_history, ...data } = user
    const userDoc = this.firestore.doc(`user/${user.id}`);
    employment_history.map(e => {
      let id = e.id
      if (id) {
        userDoc.collection(`employment`).doc(`${id}`).delete();
      }
    })
    userDoc.delete();
  }

  addNewUser(user: User, employment_history: EmploymentEntry[]) {
    const { id, ...data } = user
    this.userCollection.add(data).then(docRef => {
      employment_history.map(e => {
        let employment: Employment = { ...e }
        employment.user_id = docRef.id
        console.log(employment)
        this.firestore.collection('user').doc(docRef.id).collection('employment').add(employment);
      })
    })
  }

  convertSnapshots<T>(snaps) {
    return <T[]>snaps.map(snap => {
      return {
        id: snap.payload.doc.id,
        ...snap.payload.doc.data()
      };
    });
  }

  convertSnapshot<T>(snap) {
    return <T>{
      id: snap.payload.id,
      ...snap.payload.data()
    };
  }

  getDocumentWithSubcollection<User extends DocWithId>(user_id: string) {
    return this.firestore
      .doc<User>(`user/${user_id}`)
      .snapshotChanges()
      .pipe(
        map(this.convertSnapshot),
        map((document: User) => {
          return this.firestore.collection<Employment>(`user/${document.id}/employment`)
            .snapshotChanges()
            .pipe(
              map(this.convertSnapshots),
              map(subdocuments =>
                <User>Object.assign(document, { 'employment_history': subdocuments })
              )
            );
        }),
        flatMap(combined => combined)
      );
  }

  getDocumentsWithSubcollection<User extends DocWithId>() {
    return this.firestore
      .collection<User>('user')
      .snapshotChanges()
      .pipe(
        map(this.convertSnapshots),
        map((documents: User[]) =>
          documents.map(document => {
            return this.firestore
              .collection<Employment>(`user/${document.id}/employment`)
              .snapshotChanges()
              .pipe(
                map(this.convertSnapshots),
                map(subdocuments =>
                  Object.assign(document, { 'employment_history': subdocuments })
                )
              );
          })
        ),
        flatMap(combined => combineLatest(combined))
      );
  }
}
