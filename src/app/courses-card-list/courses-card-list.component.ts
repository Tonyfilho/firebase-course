import { CoursesService } from './../services/courses.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ICourse } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: ICourse[];

    @Output()
    courseEdited = new EventEmitter();

    @Output()
    courseDeleted = new EventEmitter<ICourse>();

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private coursesService: CoursesService) {
    }

    ngOnInit() {

    }

    editCourse(course: ICourse) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";

        dialogConfig.data = course;

        this.dialog.open(EditCourseDialogComponent, dialogConfig)

            /**If Dialog is going Close without data, we are going anything */
            .afterClosed()

            /**But if has data, AFterClose() is a Observable We going to subscribe to see if we have data when you click the Button EDIT*/
            .subscribe(val => {
                if (val) {
                    /**If Yes, we modifier data and Emit new Value by Angular OutPut event in the variable courseEdited  */
                    this.courseEdited.emit();
                }
            });

    }


    /**As We did like EditeCourse, emit a Event if the course was delete */
    OnDeleteCourse(course: ICourse) {
        /**1º** call the service and pass courseID */
        this.coursesService.deleteCourse(course.id)
        .pipe(
            /**3º** we are going to Use TAP() to pass the data was delete and emit a value like EditeCourse()
             * after Event Emitted we are going reflesh template
            */
           tap(() => {
               console.log("Deleted Course: ", course);
               this.courseDeleted.emit(course);
            }),
            /**4º we going to use CatchError(), in case Error HTTP to show a error,  */
            catchError(err =>  {
                console.log("Ops samething wrong: ", err); // for develop
                alert("Ops...Could not delete course. ");
                return throwError(err);
            })
            )
            .subscribe();
        /**2º**Subscribe, without this nothing happening, but we need to pass  information is delete was ok, or if has error */
    }

}









