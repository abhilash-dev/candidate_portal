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

  // get all records in the collection
  getUsers(): Observable<User[]> {
    this.users = this.getDocumentsWithSubcollection<User>();
    return this.users;
  }

  // get an individual document given the document ID
  getUser(id: string): Observable<User> {
    return this.getDocumentWithSubcollection<User>(id);
  }

  // updates the given user document & its sub collection emploment
  updateUser(user: User) {
    const { employment_history, ...data } = user
    const userDoc = this.firestore.doc(`user/${user.id}`);
    // update the user document
    userDoc.update(data);
    // update the subcollection data
    employment_history.map(e => {
      let id = e.id
      // if the subcollection document already exists, update its data
      if (id) {
        userDoc.collection(`employment`).doc(id).update(e);
      } else {
        // else, create a new document in subcollection
        let employment: Employment = { ...e }
        employment.user_id = user.id
        console.log(employment)
        this.firestore.collection(`user/${user.id}/employment`).add(employment);
      }
    })
  }

  // deletes all the subcollections associated with the user prior to deleting the user document
  deleteUser(user: User) {
    const { employment_history, ...data } = user
    const userDoc = this.firestore.doc(`user/${user.id}`);
    // remove all sub collection data associated with the document
    employment_history.map(e => {
      let id = e.id
      if (id) {
        userDoc.collection(`employment`).doc(`${id}`).delete();
      }
    })
    // remove the document
    userDoc.delete();
  }

  // add a new user to User collection with the subcollection employment
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

  // fetch both id & data for all documents
  convertSnapshots<T>(snaps) {
    return <T[]>snaps.map(snap => {
      return {
        id: snap.payload.doc.id,
        ...snap.payload.doc.data()
      };
    });
  }

  // fetch both id & data for a user document
  convertSnapshot<T>(snap) {
    return <T>{
      id: snap.payload.id,
      ...snap.payload.data()
    };
  }

  // fetch both the collection & sub colection data for an individual user
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

  // fetch both the collection & subcollection data
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
