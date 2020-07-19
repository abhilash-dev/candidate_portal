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

  convertSnapshots<T>(snaps) {
    return <T[]>snaps.map(snap => {
      return {
        id: snap.payload.doc.id,
        ...snap.payload.doc.data()
      };
    });
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

  addNewUser(user: User, employment_history: EmploymentEntry[]) {
    const { id, ...data } = user
    this.userCollection.add(data).then(docRef => {
      employment_history.map(e => {
        let employment: Employment = { ...e }
        employment.user_id = docRef.id
        console.log(docRef.id)
        this.firestore.collection('user').doc(docRef.id).collection('employment').add(employment);
      })
    })
  }
}
