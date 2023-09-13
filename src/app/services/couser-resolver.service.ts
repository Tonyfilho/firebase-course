import { Observable } from 'rxjs';
import { CoursesService } from './courses.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ICourse } from "../model/course";

@Injectable({
    providedIn: "root"
})


export class CourseResolver implements Resolve<ICourse> {
   
    constructor(private courseService: CoursesService) {

    }
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICourse> {       
        const courseURL = route.paramMap.get("courseUrl");       
        return this.courseService.findCourseByUrl(courseURL);

    }


}