import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Course } from '../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { convertSnap } from './db-converter-types-util';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { };


  /**Do the queries using the SPECIAL target (array contains), this type must put into que condition Query */
  /**This is a SPECIAL target content */
  /**In into the query we need:
   * 1º Where  conditions,
   * 2º OrdeBy to ordem 
   * 3º need to return a Array, you must find a way
   * 4º convert data Useing MAP Rxjs and Map of Js.Arrays
   * 5º We must return a Array, you must to convert Observable<QuerySnapshot<unknown>> to our domain model
   */
  
  loadCoursesByCategory(category: string): Observable<Course[]> {
   return  this.db.collection('courses', ref => ref.where("categories", "array-contains", category)).get().pipe(map(result => convertSnap<Course>(result)));    
  }



 /**************************Save Course */
 createCourse(newCourse: Partial<Course>, courseId?: string):Observable<Partial<Course>> {

  return;
 }




  
}
