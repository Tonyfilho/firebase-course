import { Observable } from 'rxjs';
import { CoursesService } from './courses.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ICourse } from "../model/course";

@Injectable({
    providedIn: "root"
})

/**1º We need to implement the router interface and you Method */
/**2º We need to pass the type of data that going to fetch from database , <ICourse>*/
export class CourseResolver implements Resolve<ICourse> {
    /**3º Inject the CourseService */
    constructor(private courseService: CoursesService) {

    }
    /**4º We going to create the resolve Method */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICourse> {
        /**5º We need to determine is exactly what course do we want to fetch from the database */

        /**6ª We need to grab the values from URL, ActivatedRouteSnapshot Object give us all the information that we need about route  is currently activeted by the router transition*/
        /**ParaMap, is not  query parameters that come after QUESTION MARK in URL (?). This are the parameters od the ROUTE PATH */
        const courseURL = route.paramMap.get("courseUrl");
        /**7º Use the courser Service and query the database */
        return this.courseService.findCourseByUrl(courseURL);

    }


}