import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';

import { Course } from '../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, concatMap } from 'rxjs/operators';
import { convertSnap } from './db-converter-types-util';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { };

  /*****UPDATE****
   * Will are going to have a Partial<Course> and not a full Course, because we wont update de ID */
  /**Note: The returno of Obervabble is only used to test if the Operation was SECCESSFUL of NOT */
  updataCourse(courseID: string, courseChanged: Partial<Course>): Observable<any> {
   return from (this.db.doc(`courses/${courseID}`).update(courseChanged));
  }








  
  /******SAVEALL****
   * Do the queries using the SPECIAL target (array contains), this type must put into que condition Query */
  loadCoursesByCategory(category: string): Observable<Course[]> {
    /**1º Create a Colection and pass the path.*/
    return this.db.collection('courses', ref =>
      /**2º Create a Function Reference and into the ref. pass condition Where(Name of properties("categories"), and Kind of Data("array-contains"), and Data(category)); */
      ref.where("categories", "array-contains", category))
      /**3º We are going to use GET() Method  that will create a Observable*/
      .get()
      .pipe(
        /**4º After save we are convert 1 object to Array of Couser to create our Response of Course[] */
        map(result => convertSnap<Course>(result)));
  }




  /*******SaveOne****
   * 
   * @param newCourse 
   * @param courseId 
   * @returns new Course
   * We have property call (seqNo), that property is responsable ordered entity, all the entity has a seguential number 1,2,3,4... 
   * Note: We want make sure the whenever we insert a new course entity in our database, that we are going to be polulating the sequential number3
   * with the next sequential number available.
   */
  createCourse(newCourse: Partial<Course>, courseId?: string): Observable<Partial<Course>> {
    /**1º We are going to do the Query Collection */
    /**2º We are going to create Reference and filter ref => ref.orderBy("seqNo", "desc").limit(1) and ordering by DESC*/
    return this.db.collection("courses", ref => ref.orderBy("seqNo", "desc").limit(1))
      /**We are going to use GET. Get it is going 1 time and return a Observable */
      .get().pipe(
        /**3º Get the stream with ConcatMap(), ConcatMap() will get the the value after the Observable was complete */
        /* console.log("Our RESULT ", result); */
        concatMap(result => {
          /** 4º After ConcatMap, we are going the Values e use the ConvertSnap() to receive Course[]*/
          const courses = convertSnap<Course>(result);
          /** 5º We are going get values of our course sequence with property called seqNo */
          const lastCourseSeqNo = courses[0]?.seqNo ?? 0; //Default value
          /**6º We are going to save NewCourse from the FORM, and Use Spread and increase the Sequence number + 1 */
          const course = { ...newCourse, seqNo: lastCourseSeqNo + 1 };
          /**7º We are going to save the new Course, but we are need to know IF already has this course in database OR if it is new, if We are going
           * a new ID from the FORM, the Course is NEW, orthewise the Course already exist.
           */
          let save$: Observable<any>;
          if (courseId) {
            save$ = from(this.db.doc(`courses/${courseId}`).set(course));
          }
          else {
            save$ = from(this.db.collection("courses").add(course));
          }
          /** 8º Now we are going to create a new RESPONSE to Using a  Map Operator after the return from the database */
          return save$.pipe(map(res => {
            /**9º Just to CHECK if we have ID, Using the operator BI ??, is alike a Ternary */
            return {
              id: courseId ?? res.id,
              ...course
            }
          }));
        })
      );

  }





}
