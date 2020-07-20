import { Injectable } from "@angular/core"
import { CanActivate, Router } from "@angular/router"
import { AngularFireAuth } from "@angular/fire/auth"
import { Observable } from "rxjs"
import { tap, map } from "rxjs/operators"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private afAuth: AngularFireAuth
    ) { }

    canActivate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(auth => {
                if (!auth) {
                    this.router.navigateByUrl("/login");
                    return false;
                } else {
                    return true;
                }
            })
        )
    }
}