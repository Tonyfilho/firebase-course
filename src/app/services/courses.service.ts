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
    return this.db.collection('courses', ref => ref.where("categories", "array-contains", category)).get().pipe(map(result => convertSnap<Course>(result)));
  }



  /**************************Save Course */
  /**
   * 
   * @param newCourse 
   * @param courseId 
   * @returns new Course
   * We have property call (seqNo), that property is responsable ordered entity, all the entity has a seguential number 1,2,3,4... 
   * Note: We want make sure the whenever we insert a new course entity in our database, that we are going to be polulating the sequential number3
   * with the next sequential number available.
   */
  /**
   * 1º  We need to do is it First QUERY FUNCTION the COURSES collection and get Course with the highest sequential
   * We are going to access here our Angular Firestores service and we going to acess the courses collection
   * 2º We going to take our query reference and we going to order our results by sequential number (seqNO).
   * and DESCEND ORDER and we going to LIMITE the Result, this is our query function.
   * 3º use the GET() Observable  only going to emit 1 value, the current of Database and the complete.
   * 4º after Get() we need to take this Observable and we are going to SWITCH to ANOTHER observable, dont change the ORIGINAL.
   * 5º CONACTMAP() is ideal fo save Operations, it take this Results observable from  GET, and emits a value of TYPE Course
   * and we are going to create here inside this block that is going to take care of inserting the course the database.
   * Note: The Query this is going to get us an array of RESULTS.
   * 6º We are need to extract from it the matching courses.
   * 7º We  need to convert the Result, and we have a Courses[];
   * 8º Get the last courses in our database.
   * 9º Let´st extract from the array the sequenctial number of the last course INSERTED in data, start with 0, this is FIRST course insert in the database
   * 10ª We need to protect to dont return UNDEFINE, lets protect with ELVIS Operator (?) and Default Value in case this is ZERO (??)0
   * 11ª Prepare the data that we are about to insert on the database. Var Course.
   * 12º Let,s get value from the form, and pass to var Course. using the SPREAD operator
   * 13º Add a NewCourse the sequencial Number segNo.
   * 14ª Now we have the data that we want to add to the database, we need to consider 2 SCENARIOS: IF has identifier CourseId if dont Have.
   * In both case, we want to create a SAVE Observable that is going to take care of the invertion.
   * 15º  we are going to create this observable in 2 diferentes ways, depending  on the availability of the course Identifier .
   * 16º If Have (courseId) we going to use the DOC to add in database, because we add 1 more.and pass course/ + path `courses/${courseId}`
   * use method SET() Method to insert, we MUST convert set data to  Observable with FROM, because SET return a Promise
   * 17º IF has, We use Collection and method ADD() and create a 1ª collection in our database if did not have.
   * 18º After save, lets get the Return here to emit a valid course Object the value that just inserted in the database
   * and in the case here of when we add  a Collection we dont have a IDENTIFIER yet, lets apply the MAP and to take a RESPONSE we have received here from
   * the database.
   * 19ª Map to take a Response from the database, and return a New Object.
   * 20 we are going to return Identifier if available, IF NOT we are going to retorn id from the RESPONSE res => res.id,
   * 
   *  
   */
  createCourse(newCourse: Partial<Course>, courseId?: string): Observable<Partial<Course>> {
    return this.db.collection("courses", ref => ref.orderBy("seqNo", "desc").limit(1))
      .get().pipe(
        concatMap(result => {
          console.log("Our RESULT ", result);
          const courses = convertSnap<Course>(result);
          const lastCourseSeqNo = courses[0]?.seqNo ?? 0; //Default value
          const course = { ...newCourse, seqNo: lastCourseSeqNo + 1 };
          let save$: Observable<any>;
          if (courseId) {
            save$ = from(this.db.doc(`courses/${courseId}`).set(course));
          }
          else {
            save$ = from(this.db.collection("courses").add(course));
          }
          /**Use Map to take the response from the database */
          return save$.pipe(map(res =>  {
            return { 
                id: courseId ?? res.id,
                ...course
            }
          }));
        })
      );

  }





}
