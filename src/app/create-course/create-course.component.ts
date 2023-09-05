import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ICourse } from '../model/course';
import { catchError, concatMap, last, map, take, tap, } from 'rxjs/operators';
import { from, Observable, throwError, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.css']
})
export class CreateCourseComponent implements OnInit {
  /**Get Id from the Firestore, before the form is going to create */
  /**We need to inject the AngularFirestore to do this. */
  courseId: string;
  form: FormGroup = this.fb.group({
    description: ['', Validators.required],
    categories: ["BEGINNER", Validators.required], //BEGINNER  is a start value of form field
    url: ["", Validators.required],
    longDescription: ['', Validators.required],
    promo: [false], //False is a start value of the field
    promoStartAt: [null]
  });
  constructor(private fb: FormBuilder, private afs: AngularFirestore, private courseService: CoursesService, private router: Router) {

  }
  ngOnInit(): void {
    /**Get the Value Id */
    this.courseId = this.afs.createId();

  }



  /***Very nice the way to spread the form */
  onCreateCourse() {
    const newCourse: ICourse = { ...this.form.value } as ICourse;
    /**We need to convert type: Date  to  the type: TIMESTEMP represent the moment time in Firestore database */
    newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt);
    /**We need to fix, because Categories is a Array and not a Object */
    newCourse.categories = [this.form.value.categories];
    console.log("newCourse: ", newCourse);

    this.courseService.createCourse(newCourse, this.courseId)
      .pipe(
        tap(course => {
          console.log("Created new Course: ", course);
          this.router.navigateByUrl('/courses');

        }),
        catchError(err => {
          console.log(err);
          alert("Could not create the Course");
          return throwError(err);
        })
      ).subscribe();

  }



}
