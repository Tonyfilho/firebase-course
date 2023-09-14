


import { Observable, from, pipe } from 'rxjs';
import { Injectable } from '@angular/core';

import { ICourse } from '../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, concatMap } from 'rxjs/operators';
import { convertSnap } from './_db-converter-types-util';
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
  findLessons(courseID: string, sortOrder: OrderByDirection = 'asc', pageNumber = 0, pageSize = 3): Observable<ILesson[]> {

    return this.db.collection(`courses/${courseID}/lessons`,
      ref => ref.orderBy("seqNo", sortOrder).limit(pageSize)
        .startAfter(pageNumber * pageSize)
    )
      .get()
      .pipe(
        map(results => {
          if (!results.docs.map((a) => a.data())) {
            console.log("dentro IF");
            let localLesson: ILesson[];
            localLesson.push({ id: null, description: 'no Data', duration: 'no Data', seqNo: null, courseId: null  })
            return convertSnap<ILesson>(localLesson); 
          }
          return convertSnap<ILesson>(results )
        })
      );
  }






  /*** Find By URL */ 
  findCourseByUrl(courseURL: string): Observable<ICourse | null> {    
    return this.db.collection("courses", ref => ref.where("url", "==", courseURL))      
      .get()
      .pipe(       
        map(result => {          
          const localCourses: ICourse[] = convertSnap<ICourse>(result);          
          return localCourses.length == 1 ? localCourses[0] : null;
        })
         );
  }



  /*****Delete All the colection */
  deleteCourseAndCollection(courseId: string) { 
    return this.db.collection(`courses/${courseId}/lessons`)      
      .get()      
      .pipe(        
        concatMap(results =>
        {
          const localLessons = convertSnap<ILesson>(results);         
          const batched = this.db.firestore.batch();         
          const courseREF = this.db.doc(`courses/${courseId}`).ref;       
          batched.delete(courseREF);        
          for (let lesson of localLessons) {           
            const lessonREF = this.db.doc(`courses/${courseId}/lesson/${lesson.id}`).ref;
            batched.delete(lessonREF);
          }          
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
  updataCourse(courseID: string, courseChanged: Partial<ICourse>): Observable<any> {
    return from(this.db.doc(`courses/${courseID}`).update(courseChanged));
  }



  /******SAVEALL****/  
  loadCoursesByCategory(category: string): Observable<ICourse[]> {
   
    return this.db.collection('courses', ref =>     
      ref.where("categories", "array-contains", category))      
      .get()
      .pipe(        
        map(result => convertSnap<ICourse>(result)));
  }




  /*******SaveOne****/  
  createCourse(newCourse: Partial<ICourse>, courseId?: string): Observable<Partial<ICourse>> { 
    return this.db.collection("courses", ref => ref.orderBy("seqNo", "desc").limit(1))    
      .get().pipe(       
        concatMap(result => {         
          const courses = convertSnap<ICourse>(result);          
          const lastCourseSeqNo = courses[0]?.seqNo ?? 0; //Default value         
          const course = { ...newCourse, seqNo: lastCourseSeqNo + 1 };        
          let save$: Observable<any>;
          if (courseId) {
            save$ = from(this.db.doc(`courses/${courseId}`).set(course));
          }
          else {
            save$ = from(this.db.collection("courses").add(course));
          }        
          return save$.pipe(map(res => {           
            return {
              id: courseId ?? res.id,
              ...course
            }
          }));
        })
      );

  }





}
