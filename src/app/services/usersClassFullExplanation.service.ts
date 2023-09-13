import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  /**01º Let`s Implementing  UserServices-API Design, Now our application knows if User is Log In or Not, login page is done*/
  /**02º Json WebToken containing everything that we need to do know about the user and who is the user. All this available via Firebase authentication and via the AngularFire authentication */

  /**03º We are going create a 3 Observables */
  /** 03A This Observable will receive a boolean, true  if Log In.  */
  isLoggedIn$: Observable<boolean>;

  /** 03B This Observable will receive a boolean, false if Log Out  */
  isLoggedOut$: Observable<boolean>;

  /** 03C This Observable will receive a string, and emit a URL containing the profile picture  */
  pictureUrl$: Observable<string>;

  /**04º All this information that we need to build there Observables is available VIA AngularFireAuth Services, is part of Angular Fire Authentication.  */
  /**04A Angular Fire Module it`s going to give us access to Json Web Token, that containing all this information about the Users */
  /**05º Inject this service in our AppComponent the 1º App */

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    /**04B This is Observable and subscrition return Json Token and containing all the information about the Token, let`s print out our Json Token */
    /**04C Once the user Authenticates we get back a PAYLOAD containing alot information about the user Ex: email, profile picture etc */
    /**Got to https://jwt.io/ and show the Token */
    this.afAuth.idToken.subscribe(jwtToken => { console.log("JWT: ", jwtToken); })

    /**04D this is another Observable and subscription return all this informaton about the USERS */
    this.afAuth.authState.subscribe(auth => { console.log("AUTH: ", auth); });
    /**05 In order to propagate easily that information through the rest of application, we are going to using the userService */
    /**05A We are won`t to use the AngularFire Service Directly throughout the rest the application */

    /** !! If the value from the observable was Undefine, the return will False, if the value of Observable has a Object the return will True  */
    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
    /**loggedOut will receive the !isloggedIn*/
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggeIn => !loggeIn));

    /**Let´s check if Observable is available, in other hand if this user object is available or is not let`s emit here null value */
    this.pictureUrl$ = this.afAuth.authState.pipe(map(userInfo => userInfo ? userInfo.photoURL : null));

    /**06_Let`s consume this observables and show or hide certain elements of the user interface, let`s AppComponent */

  }


  /**07 call to SingOut() method, The AngularFire Authentication State Observable is going to Emit new Value as undefined, with this value the Observable isLoggedIn$  will receive it */
  /**It is going to notify the rest the application this is no longer a user currently logged */
  logOut() {
    this.afAuth.signOut();
    this.router.navigateByUrl("/login");
  } 


}
