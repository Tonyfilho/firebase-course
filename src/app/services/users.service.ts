import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

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
  pictureUrl$: Observable<boolean>;

  /**04º All this information that we need to build there Observables is available VIA AngularFireAuth Services, is part of Angular Fire Authentication.  */
  /**04A Angular Fire Module it`s going to give us access to Json Web Token, that containing all this information about the Users */
  /**05º Inject this service in our AppComponent the 1º App */

  constructor(private afAuth: AngularFireAuth) {
    /**04B This is Observable and subscrition return Json Token and containing all the information about the Token, let`s print out our Json Token */
    /**04C Once the user Authenticates we get back a PAYLOAD containing alot information about the user Ex: email, profile picture etc */
      this.afAuth.idToken.subscribe(jwtToken => 
        { console.log("JWT: ", jwtToken); })

    /**04D this is another Observable and subscription return all this informaton about the USERS */
    this.afAuth.authState.subscribe(auth =>  { console.log("AUTH: ", auth); })
    /**05 In order to propagate easily that information through the rest of application, we are going to using the userService */
    /**05A We are won`t to use the AngularFire Service Directly throughout the rest the application */
  

   }





}
