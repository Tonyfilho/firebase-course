import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    /**1º FirebaseUI LIBRARY Use internally FirebaseSDK.and create a variable*/
    ui: firebaseui.auth.AuthUI;

    /**2º So we need to first wait for Firebase SDK to be fully initialized before initializing here*/
    /**3º Inject here AngularFireAuth Service, allow us to interact with all the authentication related functionality  */
    constructor(private afAuth: AngularFireAuth, private router: Router) {

    }

    ngOnInit() {
        /**4º Start o SDK. It is a Promise. App is a promise that successfully evaluated , is going to get us back here */
        /**Successfully is get a Object containing all the o properties of the Running Firebase SKG Application */
        this.afAuth.app.then(app => {
            /**5º After Initialize, we need to configure thing such as what to do when the login is SuccessFul or what type of social login providers should we user */
            const uiConfig = {
                /**6º Receive a list with type os providers */
                signInOptions: [
                    EmailAuthProvider.PROVIDER_ID,
                    GoogleAuthProvider.PROVIDER_ID
                ],
                /**7º We are going to config a new Object called callbacks, there are multiples callbacks avaiable, but One that we needs, if sign in successfull */
                callbacks: {
                    /**8º We are going to add a new method to out Login Component call the firebase here, and pass the Reference of method, dont call */
                    /**9º We need to BIND instead of to call() this method */
                    signInSuccessWithAuthResult: this.onLoginSSuccessFul.bind(this)
                }
            };
            /**10º We are going to start FirebaseUI construction and pass promise return app.auth()  */
            this.ui = new firebaseui.auth.AuthUI(app.auth());
            /**11º After calling the constructor function, we can now bootstrap the firebaseUI library, and call here start method */

            /**12º we pass DIV id=firebaseui-auth-container of that DIV, into  the start(), and Var uiConfig */
            this.ui.start("#firebaseui-auth-container", uiConfig);

            /**15º just to try out our functionality, we are going to apply another option FirebaseUI library, this way will return the USERS and always have to sign in again */
          //  this.ui.disableAutoSignIn();

        });

        /**16º Let`s Implementing An Agular UserServices-API Design, Now our application knows if User is Log In or Not*/


    }
    onLoginSSuccessFul(result) {
        console.log("Firebase UI Result: ", result);
        /**14º if the login is successfully,  we need to change the route */
        this.router.navigateByUrl("/");
    }

    ngOnDestroy() {
        /**13º We are going to destroy this  Firebase Instance component using the method Delete() */
        this.ui.delete();

    }
}


