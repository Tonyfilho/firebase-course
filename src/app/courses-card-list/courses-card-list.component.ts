import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Course } from "../model/course";
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
    courses: Course[];

    @Output()
    courseEdited = new EventEmitter();

    @Output()
    courseDeleted = new EventEmitter<Course>();

    constructor(
        private dialog: MatDialog,
        private router: Router) {
    }

    ngOnInit() {

    }

    editCourse(course: Course) {

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

}









