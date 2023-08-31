import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';


import 'firebase/firestore';

import { AngularFirestore } from '@angular/fire/firestore';



@Component({
    selector: 'aboutSnapShotComponent',
    templateUrl: './about-with-snapshot-changes.component.html',
    styleUrls: ['./../about/about.component.css']
})
export class AboutSnapShotComponent {

    constructor(private db: AngularFirestore) {
    }


    removeId(data: any) {
        const newData: any = { ...data };
        delete newData.id;
        return newData;
    }

    /**
     * **************NOTE:******************************************
     * *We got some methods called  Observable<Action<DocumentSnapshot<unknown>>> or REAL TIME UPDATE, this kind Observable will trigger update without you hit the button or do any update in your application. 
     * Ex: A stock of the goods and you have 5 sellers selling  this goods in the same time.
     */

    /**Doc Method is used to read a SIGLE Doc in data Base, GET is Obervable just emit ONLY ONE VALUE */
    onReadDoc() {
        this.db.doc('/courses/08iaoDSzIvve0fACKMNn').snapshotChanges().subscribe(snap => {
            // console.log("snap.payload: ", snap.payload.id);
            //  console.log("payload.data(): ", snap.payload.data());
        });
    }


    /**Collection Method is Method to get one Colletion With SnapShotChanges() Long lived  Observables */
    ReadCollections() {
        this.db.collection('courses').snapshotChanges().subscribe(snap => {
            snap.forEach(snap => {
                //   console.log("FOREACH => snap.payload.doc.id: ", snap.payload.doc.id );
                //  console.log("FOREACH => snap.payload.doc.data(): ", snap.payload.doc.data());
            }); //List of DOCS

        })
        this.ReadOneLessonCollection();
        this.ReadOneLessonCollectionWhere();


    }

    ReadOneLessonCollection() {
        this.db.collection('/courses/08iaoDSzIvve0fACKMNn/lessons').snapshotChanges().subscribe(snap => {
            snap.forEach(snap => {
                // console.log("FOREACH LESSON COLLECTION => snap.payload.doc.id: ", snap.payload.doc.id);
                //  console.log("FOREACH LESSON COLLECTION => snap.payload.doc.data(): ", snap.payload.doc.data());
            }); //List of DOCS

        })
    }



    /**We put a condition here WHERE */
    ReadOneLessonCollectionWhere() {
        this.db.collection('/courses/08iaoDSzIvve0fACKMNn/lessons', ref => ref.where('seqNo', "<=", 5).orderBy('seqNo')).snapshotChanges().subscribe(snap => {

            snap.forEach(snap => {
                // console.log("FOREACH LESSON COLLECTION => snap.payload.doc.id: ", snap.payload.doc.id);
                //  console.log("FOREACH LESSON COLLECTION => snap.payload.doc.data(): ", snap.payload.doc.data());
            }); //List of DOCS

        })
    }


    /******************COLLECTION GROUP***************************** */

    /**We have a Collection called (COURSES) and into this Collection we have OTHER Collection called (LESSONS)  */
    /**We will create a QUERY to GET all the nested collection, in other words snapshotChanges() will get all the Collection NESTED, if has any Update
     * snapshotChanges() will trigger this update.
      */
    /**CollectionGroup('NomeOfNestedCollection) will get all the collection independently of WHERE thet are Situated */
    /**We must to pass a querie REFERENCE. */
    ReadCollectionsGroup() {

        this.db.collectionGroup("lessons", ref => ref.where("seqNo", "==", 1))
            .snapshotChanges().subscribe(snap => {
                snap.forEach(snap => {
                    console.log("QUERY GROUP: snap.payload.doc.id: ", snap.payload.doc.id);
                    console.log("QUERY GROUP: snap.payload.doc.data(): ", snap.payload.doc.data());
                }); //List of DOCS

            });
    }
}
















