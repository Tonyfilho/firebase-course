import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ICourse } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { CoursesService } from '../services/courses.service';


@Component({
    selector: 'edit-course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent {
    localCourse!: ICourse;
    formUpDate: FormGroup;
    /**Angular Material */
    /**
     * 1º We are going to get the Reference of Template, to save o close dialog.
     * 2º Inject a decorator:  @Inject(MAT_DIALOG_DATA) course: Course to get data via Inject Token from the Material
     * 3ª FormBuilder to update the course.
     * 4º create the form and SET the Default Values.
     * 5º Save in the dataBase
     */
    constructor(private dialogRef: MatDialogRef<EditCourseDialogComponent>, private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private course: ICourse, private courseService: CoursesService) {
        //  console.log("couser: ", course.description);
        this.localCourse = course;
        this.formUpDate = fb.group({
            description: [this.localCourse.description, Validators.required],
            promo: [this.localCourse.promo],
            longDescription: [this.localCourse.longDescription, Validators.required]
        })
    }

    saveUpdate() {
        /**Remember, you Must subscribe(), without this nothing happening.
         * into the Subscrition Block will close the Dialog and emit a value of RESULT, is a Option
         */
        const saveChangeCourses = this.formUpDate.value;
        this.courseService.updataCourse(this.course.id, saveChangeCourses).subscribe(() => {
            /**this Close(), will are distinguish situation when we have closed the dialog, Using the button Close(), 
             * without modifying any data, or situation where we are closing the dialog AFTER a SUCCESSFUL of Observable.
             */
            this.dialogRef.close(saveChangeCourses);
        });
    }


    closeDialog() {
        this.dialogRef.close();
    }
}






