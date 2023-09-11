import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ICourse} from '../model/course';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ILesson} from '../model/lesson';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  loading = false;

  displayedColumns = ['seqNo', 'description', 'duration'];
  course!: ICourse;
  
  constructor(private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    /**Get the value via RESOLVER SERVICES */
    this.course = this.route.snapshot.data["course"];
    
  }

}
