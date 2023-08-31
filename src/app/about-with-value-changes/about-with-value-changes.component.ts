import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-about-with-value-changes',
  templateUrl: './about-with-value-changes.component.html',
  styleUrls: ['./../about/about.component.css']
})
export class AboutWithValueChangesComponent {

  constructor(private db: AngularFirestore) {
  }


  removeId(data: any) {
    const newData: any = { ...data };
    delete newData.id;
    return newData;
  }

  /**
   * **************************************************************************NOTE:******************************************
   * *We got some methods called the Long lived  Observables or REAL TIME UPDATE, After first  event, they will remain relink indefinitely until we either UNSUBSCRIBE
   * from the Observable or simples close the application.
   */
  /*************ValueChanges is used with you just need the DATA and does not needs of ID***************************/

  /**Doc Method is used to read a SIGLE Doc in data Base, GET is Obervable just emit ONLY ONE VALUE */
  onReadDoc() {
    this.db.doc('/courses/08iaoDSzIvve0fACKMNn').valueChanges().subscribe(data => {
     // console.log("data ", data);

    });
  }


  /**Collection Method is Method to get one Colletion With valueChanges() Long lived  Observables */
  ReadCollections() {
    this.db.collection('courses').valueChanges().subscribe(snap => {
      snap.forEach(data => {
         // console.log("FOREACH => data: ", data );         
      }); //List of DOCS

    })
    this.ReadOneLessonCollection();
    this.ReadOneLessonCollectionWhere();


  }

  ReadOneLessonCollection() {
    this.db.collection('/courses/08iaoDSzIvve0fACKMNn/lessons').valueChanges().subscribe(data => {
      data.forEach(data => {
        console.log("FOREACH LESSON COLLECTION => DATA LESSON: ", data);
         
      }); //List of DOCS

    })
  }



  /**We put a condition here WHERE */
  ReadOneLessonCollectionWhere() {
    this.db.collection('/courses/08iaoDSzIvve0fACKMNn/lessons', ref => ref.where('seqNo', "<=", 5).orderBy('seqNo')).valueChanges().subscribe(data => {

      data.forEach(data => {
         console.log("FOREACH LESSON COLLECTION WHERE SEQNO <= 5 DATA LESSON: ", data);         
      }); //List of DOCS

    })
  }


  /******************COLLECTION GROUP***************************** */

  /**We have a Collection called (COURSES) and into this Collection we have OTHER Collection called (LESSONS)  */
  /**We will create a QUERY to GET all the nested collection, in other words valueChange() will get all the Collection NESTED, if has any Update
   * valueChange() will trigger this update.
    */
  /**CollectionGroup('NomeOfNestedCollection) will get all the collection independently of WHERE thet are Situated */
  /**We must to pass a querie REFERENCE. */
  ReadCollectionsGroup() {

    this.db.collectionGroup("lessons", ref => ref.where("seqNo", "==", 1))
      .valueChanges().subscribe(data => {
        data.forEach(data => {
          console.log("QUERY GROUP: data.payload.doc.id: ", data);          
        }); //List of DOCS

      });
  }
}


