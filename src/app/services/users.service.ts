import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isLoggedIn$: Observable<boolean>; 
  isLoggedOut$: Observable<boolean>; 
  pictureUrl$: Observable<string>;
  
  
  
  constructor(private afAuth: AngularFireAuth, private router: Router) {   
    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggeIn => !loggeIn));  
    this.pictureUrl$ = this.afAuth.authState.pipe(map(userInfo => userInfo ? userInfo.photoURL: null));
    /**_Let`s consume this observables and show or hide certain elements of the user interface, let`s to AppComponent */   
    
   }
   
   logOut() {
     this.afAuth.signOut();
     this.router.navigateByUrl("/login");
   } 




}
