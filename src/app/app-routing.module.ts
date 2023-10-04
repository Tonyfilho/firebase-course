import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CourseComponent } from './course/course.component';
import { LoginComponent } from './login/login.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { CreateUserComponent } from './create-user/create-user.component';
import { AboutSnapShotComponent } from './about-with-snapshot-changes/about-with-snapshot-changes.component';
import { AboutWithValueChangesComponent } from './about-with-value-changes/about-with-value-changes.component';
import { CourseResolver } from './services/couser-resolver.service';

/**
 * ***************************************RedirectUnauthorizedToLogin*****************************************************
 * 1º We need to created a AuthPipe Function with redirectUnauthorizedTo() and pass router navegation parameters, we are going to target the page
 * 2º At CanActive we  are going to pass a Array  and Object data: {}, into the Object data we going to pass the Pipe Function.
 **/
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

/**
 * ***********************************AdminOnly***************************************************************************
 * 1º We need to create a AuthPipe Funtion with hasCustomClaim() and pass the Claim.
 * 2º At CanActive we  are going to pass a Array  and Object data: {}, into the Object data we going to pass the Pipe Function.
 * 3º So is mean that if the admin property is presenton the Custom Claim Object in our Authetication Json Web  Token, then this AythPipe is going
 * to be considered TRUE and access is going to be granted, otherwise , if it´s  FALSE the access to be Denied.
 */

const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'create-course',
    component: CreateCourseComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly }

  },
  {
    path: 'create-user',
    component: CreateUserComponent,  canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly }

  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'about-with-snapshot-changes',
    component: AboutSnapShotComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly }
  },
  {
    path: 'about-with-values-changes',
    component: AboutWithValueChangesComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    /**This is mean that whenever there is a routing transition, we need to find a COURSE in order to make a It 
     * available here to target component and process of Fetching
     * that COURSE from somewhere
     */
    path: 'courses/:courseUrl',
    component: CourseComponent,
    resolve: {
      course: CourseResolver
    }, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
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
