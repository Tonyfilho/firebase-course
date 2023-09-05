import { Component, OnInit } from '@angular/core';
import { ICourse } from '../model/course';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { CoursesClassFullService } from '../services/coursesClassFullDummy.service';



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  beginnersCourses$: Observable<ICourse[]>;

  advancedCourses$: Observable<ICourse[]>;

  constructor(
    private router: Router, private courseService: CoursesService, private courseService2: CoursesClassFullService) {

  }

  ngOnInit() {
    this.reloadCourses();
    /**It was used | Async 
    this.beginnersCourses$.subscribe(data => { console.log("Beginners: ", data)})
   this.advancedCourses$.subscribe(data => { console.log("Advanced: ", data)})*/
  }

  /**Fetch Methods */
  reloadCourses() {
    this.beginnersCourses$ = this.courseService.loadCoursesByCategory('BEGINNER');
    this.advancedCourses$ = this.courseService2.loadCoursesByCategory2('ADVANCED');
  }

}
