import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
//import { PlanningSessionComponent } from './planning-session/planning-session.component'
import { CreateSessionComponent } from './create-session/create-session.component'

const routes: Routes = [
//  {
//    path: 'session/:id',
//    component: PlanningSessionComponent,
//  },
  { path: '',
    component: CreateSessionComponent,
    pathMatch: 'full'
  },
//  {
//    path: '**', component: PageNotFoundComponent
//  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
