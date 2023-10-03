import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, tap } from 'rxjs/operators';
import { IUserRoles } from '../model/user-roles';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isLoggedIn$: Observable<boolean>; 
  isLoggedOut$: Observable<boolean>; 
  pictureUrl$: Observable<string>;
  roles$: Observable<IUserRoles>; /**The Role came from FireStore Authetication */
  
  
  
  constructor(private afAuth: AngularFireAuth, private router: Router) {   
    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggeIn => !loggeIn));  
    this.pictureUrl$ = this.afAuth.authState.pipe(map(userInfo => userInfo ? userInfo.photoURL : "./../images/no_avatar.png"));
    /**_Let`s consume this observables and show or hide certain elements of the user interface, let`s to AppComponent */   
   
    /**Ex: using Tap or Map C:\_Angular\firebase-course\images\no_avatar.png */
   this.afAuth.idTokenResult.pipe(tap(token => {token?.claims, console.log("Token.Claims: ", token?.claims['admin'])})).subscribe();
   this.roles$ = this.afAuth.idTokenResult.pipe(map(token => <any>token?.claims['admin'] ?? {admin: false})); /**If dont have Claims let set the Flag  Admin: False */
    
   }
   
   logOut() {
     this.afAuth.signOut();
     this.router.navigateByUrl("/login");
   } 




}
