import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Course } from '../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

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
   * 
   */
  loadCoursesByCategory(category: string): Observable<Course[]> {
    /**We must return a Array, you must to convert Observable<QuerySnapshot<unknown>> to our domain model*/
   return  this.db.collection('courses', ref => ref.where("categories", "array-contains", category)).get().pipe(map(result => {
     return result.docs.map(snap => {
       return { id: snap.id, ...snap.data as unknown as Course }  
       /** return { id: snap.id,  ...<any>snap.data(),}; OR this bellow way */
      })
    }));

    
  }
}
