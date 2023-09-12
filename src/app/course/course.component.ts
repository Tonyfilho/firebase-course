import { CoursesService } from './../services/courses.service';
import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from '../model/course';
import { finalize, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { ILesson } from '../model/lesson';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, OnDestroy {

  loading = false;
  lastPageLoaded = 0;  /** this is firstPage will get load, start with zero*/
  displayedColumns = ['seqNo', 'description', 'duration'];
  course!: ICourse;
  lessons!: ILesson[];
  subs: Subscription;

  constructor(private route: ActivatedRoute, private couserService: CoursesService) {
  }
  ngOnInit() {
    this.loading = true;
    /**Get the value via RESOLVER SERVICES */
    this.course = this.route.snapshot.data["course"];
    this.subs = this.couserService.findLessons(this.course.id)
      .pipe(
        /**when the Observable Finalize, or Success or Error the Finalize will call */
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data: ILesson[]) => {this.lessons = data, console.log("1* page lesson: ", data)},
        error: err => { },
        complete: () => { }
      }
      );

  }
  loadMore() {
    /**Paginator increase here*/
    this.lastPageLoaded++;
    this.loading = true; /**activate spinner */
    this.couserService.findLessons(this.course.id, "asc", this.lastPageLoaded)
      .pipe(
        /**Using Finalize, when the Observable is done or Sucess or Error, finalize will be call */
        finalize(() => this.loading = false)
      )
      /**If you dont put subscribe nothing happening */

      .subscribe(
        /**Let`s grab here the lessons that we have received and let`s APPEND it to the lessons array */
        /**Let`s remember this might include several pages of lessons and let`s CONCAT this a new page */
        localLessons => this.lessons = this.lessons.concat(localLessons));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
