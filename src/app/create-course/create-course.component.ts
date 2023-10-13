import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ICourse } from '../model/course';
import { catchError, concatMap, last, map, take, tap, } from 'rxjs/operators';
import { from, Observable, throwError, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.css']
})
export class CreateCourseComponent implements OnInit {
  courseId!: string;
  percentageChanges$!: Observable<number>;
  iconUrl!: string;

  form: FormGroup = this.fb.group({
    description: ['', Validators.required],
    categories: ["BEGINNER", Validators.required], //BEGINNER  is a start value of form field
    url: ["", Validators.required],
    longDescription: ['', Validators.required],
    promo: [false], //False is a start value of the field
    promoStartAt: [null]
  });
  /**Get Id from the Firestore, before the form is going to create */
  /**We need to inject the AngularFirestore to do this. */
  constructor(private fb: FormBuilder,
    private afs: AngularFirestore,
    private courseService: CoursesService,
    private router: Router,
    private storage: AngularFireStorage

  ) {

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

  uploadThumbnail(event) {
    //  console.log("Our  Event: ", event);
    const file: File = event.target.files[0];
    // console.log("File Name: ", file.name);
    /**1º We need to create a Path Course*/
    /**2º We need to create Sub Folder with ID , SubFolder need to be UNIQUE per course*/
    /**3º We are going to upload the file with original Name*/
    /**4º We are going to storage with Upload() Method, */
    const filePath = `courses/${this.courseId}/${file.name}`;
    /**4Aº We are going to pass the Path and File and Object with any metadata under the form of Http Headers, the Headers are going to be served whenever we download the file in the future, */
    /**In our case, because this. file is not going to change often we want to be Cached for a very long time */
    /**This way we won`t have to download the file Each Time that we access the page that is showing ou data Thumbnail*/
    /**The File is going to be Nicely Cached oh the User´s Browser*/
    /**5º when  we call the upload file, this is not going to trigger the Upload immediately, we need to get back here is AngularFireUploadTask */
    const task: AngularFireUploadTask = this.storage.upload(filePath, file, {
      cacheControl: "max-age=2592000,public"
    });

    /**Get the Obervable the number to Mat-Progress-Bar */
    this.percentageChanges$ = task.percentageChanges();
    /**We are going to create a Safe Download URL */
    /**1º We need to take a Snapshot Change Observable e WAIT the Upload before creating a safe Download URL */
    task.snapshotChanges().pipe(
      /**2º we are using the LAST(). The Last Operator is going to Take the Source Observable and it`s going to WAIT for it to complete before emitting by SUBSCRIBE
       * Any value emitted here are going to accur ONLY when the FILE has been FULLY Uploaded.*/
      /** With the LAST() we going to Emitt One Value*/
      last(),
      /**3º After the File got fully Uploaded, We want to do is to turn that Event and make another Request in Firebase Storage  to create a Safe Download URL*/
      /** We going to use ConcatMap in order to take this event and convert it into Another Request to Firebase Storage */

      concatMap(() => { 
        /**4º We going to access Firebase Storage and pass the Path and get a REFERENCE to UpLoaded File and CREATE a URL */
        return this.storage.ref(filePath).getDownloadURL() }),
        /**5º After create a URL with are going to save our component*/
      tap(url => this.iconUrl = url ),
      /** 6º We going create here ErroHandling Logic in case the Error in this Operation Using the CatchError */
      catchError(err => {
        /**If the Error Occur, we are going to create a console and create a Alert from Js */
        console.error(err);
        alert("Ops Something Wrong with upload: Could not create thumbnail and URL ");
        /** 7º Return Here a replace Observable ThrowError*/
        return throwError(err);
      })).subscribe();






  }



}
