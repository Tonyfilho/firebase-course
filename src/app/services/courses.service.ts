


import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';

import { ICourse } from '../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, concatMap } from 'rxjs/operators';
import { convertSnap } from './db-converter-types-util';
import { ILesson } from '../model/lesson';

/**Note: The Way of import, is different*/
import firebase from 'firebase';
import OrderByDirection = firebase.firestore.OrderByDirection;



@Injectable({
  providedIn: 'root'
})
export class CoursesService {



  constructor(private db: AngularFirestore) { };



  /*** Find Lesson with Paginator */
  /**Will return a List of Lesson but with paginator */

  findLessons(courseID: string, sortOrder: OrderByDirection = 'asc', pageNumber = 0, pageSize = 3): Observable<ILesson[]> {
    /**1º Path list of Lessons */
    /**2º Ref ordeBy the ASC */
  return  this.db.collection(`courses/${courseID}/lessons`,
    /**3º Limit of the data per page */ 
    ref => ref.orderBy("segNo", sortOrder).limit(pageSize)
    /**4º Pagenator quantity*/
    .startAfter(pageNumber * pageSize)    
    )
    /**5º Grab the Get will return a Observable */
    .get()
    /**6º We are going to get a list of query results, and use MAP() Rxjs, we are going to MAP the Observable of the courses or Null*/
    .pipe(
      map(result => convertSnap(result))
    );

    

  }






  /*** Find By URL */
  /**Will return only on data in database */
  findCourseByUrl(courseURL: string): Observable<ICourse | null> {
    /**1º Get all the collection and created a REF with where is property is same of courseURL */
    return this.db.collection("courses", ref => ref.where("url", "==", courseURL))
      /**2º grab the get Observable, as usual to get current results */
      .get()
      .pipe(
        /**3º We are going to get a list of query results, and use MAP() Rxjs, we are going to MAP the Observable of the courses or Null*/
        map(result => {
          console.log("Results.doc :", result.docs);
          /**4º We are still going to get here an Array back as a results, we need to convert it */
          result.docs.map(dataResults => { console.log("list dataResults.data(): ", dataResults.data()) });
          const localCourses: ICourse[] = convertSnap<ICourse>(result);
          /**5º If the courses results is 1 value,is right, or other hand we not find any results  or if find multiples results, then the results will be Null
           * or ather hand our query is invalid. */
          return localCourses.length == 1 ? localCourses[0] : null;
        })
        /**6º Now we  need to configure this as RESOLVER in you routeModule */

      );

  }



  /*****Delete All the colection */
  /******Undestand Firebase Transactional Batched Writes****  */
  deleteCourseAndCollection(courseId: string) {
    /**1º We going to to acess courses collection, and acess nested collection LESSONS   */
    return this.db.collection(`courses/${courseId}/lessons`)
      /**2º let call get() and receive a  Observable to retreive all */
      .get()
      /**3º Lest modification that request in Data Modification Request, remamber this a list, into the another List 
       * Note: This is a READ Request , we are reading the Lessons From database.*/
      .pipe(
        /*4º Transform Read Transaction in Write Transaction, We going to delete from database every sigle lesson retrieved here from this query courses/${courseId}/lessons  * */
        concatMap(results =>
        /**5º We are using this because we want to turn an Observable into another observable, Into the ResultCourse contain several RESULTs  */ {
          /**6º Get all the lessons results, and convert it in ILesson[]*/
          const localLessons = convertSnap<ILesson>(results);
          /**7º We going to loop through them one by one, delete each of the Lesson and the end the delete the course, We need to do this in One single Transaction  */
          /**8º Name the Transaction in FireStare is call the Batched Write, We goig to create a new Batched Write */
          const batched = this.db.firestore.batch();
          /**Batched Write Operation is Atomic operation like SQL  Database transaction, this means that either all of operations of the batch are SUCCESSFULL executed in the database*/
          /**OR all the alternatively, if something goes wrong, then NONE ALL the operations go through, jut like SQL */
          /**9º We going to delete Course Document, for that We need Firestore Reference to Document, Let`s Grab the Ref, using Angular Firestore Service and pass the Path, const courseRef: DocumentReference<unknown> */
          const courseREF = this.db.doc(`courses/${courseId}`).ref;
          /**10º Our Case we want to Delete the course, and pass here Course Reference */
          batched.delete(courseREF);
          /**11º Now we all have to do is a loop for all Lessson[] and delete like the Course[] */
          for (let lesson of localLessons) {
            /**12º We need to gran the Lessons Ref*/
            const lessonREF = this.db.doc(`courses/${courseId}/lesson/${lesson.id}`).ref;
            batched.delete(lessonREF);
          }
          /**Batched.commit(), will return a Promise we must convert it a Observable using From Rxjs */
          return from(batched.commit());
        }
        )
      );
  }

  /*****Delete Top data Collection, without delete nested Collection data */
  deleteCourse(courseID: string) {
    return from(this.db.doc(`courses/${courseID}`).delete());
  }




  /*****UPDATE*****/
  /* Will are going to have a Partial<Course> and not a full Course, because we wont update de ID */
  /**Note: The returno of Obervabble is only used to test if the Operation was SECCESSFUL of NOT */
  updataCourse(courseID: string, courseChanged: Partial<ICourse>): Observable<any> {
    return from(this.db.doc(`courses/${courseID}`).update(courseChanged));
  }



  /******SAVEALL****/
  /* Do the queries using the SPECIAL target (array contains), this type must put into que condition Query */
  loadCoursesByCategory(category: string): Observable<ICourse[]> {
    /**1º Create a Colection and pass the path.*/
    return this.db.collection('courses', ref =>
      /**2º Create a Function Reference and into the ref. pass condition Where(Name of properties("categories"), and Kind of Data("array-contains"), and Data(category)); */
      ref.where("categories", "array-contains", category))
      /**3º We are going to use GET() Method  that will create a Observable*/
      .get()
      .pipe(
        /**4º After save we are convert 1 object to Array of Couser to create our Response of Course[] */
        map(result => convertSnap<ICourse>(result)));
  }




  /*******SaveOne****/
  /* * 
   * @param newCourse 
   * @param courseId 
   * @returns new Course
   * We have property call (seqNo), that property is responsable ordered entity, all the entity has a seguential number 1,2,3,4... 
   * Note: We want make sure the whenever we insert a new course entity in our database, that we are going to be polulating the sequential number3
   * with the next sequential number available.
   */
  createCourse(newCourse: Partial<ICourse>, courseId?: string): Observable<Partial<ICourse>> {
    /**1º We are going to do the Query Collection */
    /**2º We are going to create Reference and filter ref => ref.orderBy("seqNo", "desc").limit(1) and ordering by DESC*/
    return this.db.collection("courses", ref => ref.orderBy("seqNo", "desc").limit(1))
      /**We are going to use GET. Get it is going 1 time and return a Observable */
      .get().pipe(
        /**3º Get the stream with ConcatMap(), ConcatMap() will get the the value after the Observable was complete */
        /* console.log("Our RESULT ", result); */
        concatMap(result => {
          /** 4º After ConcatMap, we are going the Values e use the ConvertSnap() to receive Course[]*/
          const courses = convertSnap<ICourse>(result);
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
