import { NgModule } from '@angular/core';
import  {RouterModule,Routes} from '@angular/router';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';

const appRoutes:Routes=[
{path:"create",component:CreateEmployeeComponent},
{path:"list",component:ListEmployeeComponent},
{path:"edit/:id",component:CreateEmployeeComponent},
{path:'',redirectTo:"/list",pathMatch:'full'}
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
