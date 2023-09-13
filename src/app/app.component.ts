import { UsersService } from './services/users.service';
import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {from, Observable} from 'rxjs';
import {concatMap, filter, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /**Change to Public to has access our template AppComponent:HTML */
  constructor(public user: UsersService) {

  }

  ngOnInit() {

  }

  logOut() {
    this.user.logOut();
  }

}
