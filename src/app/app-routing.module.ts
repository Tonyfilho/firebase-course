import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {CourseComponent} from './course/course.component';
import {LoginComponent} from './login/login.component';
import {CreateCourseComponent} from './create-course/create-course.component';
import {AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {CreateUserComponent} from './create-user/create-user.component';
import { AboutSnapShotComponent } from './about-with-snapshot-changes/about-with-snapshot-changes.component';
import { AboutWithValueChangesComponent } from './about-with-value-changes/about-with-value-changes.component';
import { CourseResolver } from './services/couser-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'create-course',
    component: CreateCourseComponent

  },
  {
    path: 'create-user',
    component: CreateUserComponent

  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'about-with-snapshot-changes',
    component: AboutSnapShotComponent
  },
  {
    path: 'about-with-values-changes',
    component: AboutWithValueChangesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    /**This is mean that whenever there is a routing transition, we need to find a COURSE in order to make a It 
     * available heree to target component and process of Fetching
     * that COURSE from somewhere
     */
    path: 'courses/:courseUrl',
    component: CourseComponent,
    resolve: {
      course: CourseResolver
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
