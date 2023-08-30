import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';


import 'firebase/firestore';

import { AngularFirestore } from '@angular/fire/firestore';
import { COURSES, findLessonsForCourse } from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = { ...data };
        delete newData.id;
        return newData;
    }


    /**Doc Method is used to read a SIGLE Doc in data Base, GET is Obervable just emit ONLY ONE VALUE */
    onReadDoc() {
        this.db.doc('/courses/08iaoDSzIvve0fACKMNn').get().subscribe(snap => {
            console.log("snap.id: ", snap.id);
            console.log("snap.data(): ", snap.data());
        });
    }


    /**Collection Method is Method to get one Colletion is Obervable just emit ONLY ONE VALUE */
    ReadCollections() {
        this.db.collection('courses').get().subscribe(snap => {
            //  console.log("snap.query: ", snap.query);
            //  console.log("snap.docs: ", snap.docs); //List of DOCS

            snap.forEach(snap => {
              //  console.log("FOREACH => snap.id: ", snap.id);
               // console.log("FOREACH => snap.data(): ", snap.data());
            }); //List of DOCS

        })
        this.ReadOneLessonCollection();
        this.ReadOneLessonCollectionWhere();
    }
    ReadOneLessonCollection() {
        this.db.collection('/courses/08iaoDSzIvve0fACKMNn/lessons').get().subscribe(snap => {
            snap.forEach(snap => {
               // console.log("FOREACH LESSON COLLECTION => snap.id: ", snap.id);
              //  console.log("FOREACH LESSON COLLECTION => snap.data(): ", snap.data());
            }); //List of DOCS

        })
    }
    /**We put a condition here WHERE */
    ReadOneLessonCollectionWhere() {
        this.db.collection('/courses/08iaoDSzIvve0fACKMNn/lessons', ref => ref.where('seqNo', "<=", 5).orderBy('seqNo')).get().subscribe(snap => {

            snap.forEach(snap => {
                console.log("FOREACH LESSON COLLECTION WHERE SEQNO <= 5 snap.id: ", snap.id);
                console.log("FOREACH LESSON COLLECTION WHERE SEQNO <= 5  snap.data(): ", snap.data());
            }); //List of DOCS

        })
    }


}
















