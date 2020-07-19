import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore"
import { Observable, combineLatest } from "rxjs";
import { map, flatMap } from "rxjs/operators"
import { User } from "../models/user"
import { Employment } from "../models/employment"



interface DocWithId {
  id: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;
  emplymentCollection: AngularFirestoreCollection<Employment>;
  users: Observable<User[]>;
  user: Observable<User>;
  employment_history: Observable<Employment[]>;

  constructor(private firestore: AngularFirestore) {
    this.userCollection = this.firestore.collection('user');
    this.emplymentCollection = this.firestore.collection('employment', ref => ref.orderBy('from', 'desc'));
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
}
