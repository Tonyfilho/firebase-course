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
        next: (data: ILesson[]) => this.lessons = data,
        error: err => { },
        complete: () => { }
      }
      );

  }
  loadMore() {
    /**Paginator */
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
