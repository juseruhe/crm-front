import { Injectable, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { userListComponent } from "./user-list.component";
import {
  
  userDetailGuard,
  userEditGuard
} from "./user-guard.service";


import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "src/app/shared/shared.module";
import { MaterialModule } from "src/app/shared";
import { userComponent } from "./user-form.component";
import { CustomerService } from '../customer';
@Injectable({
  providedIn: 'root'
})

@NgModule({
  imports: [
    SharedModule,
    // ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    RouterModule.forChild([
      { path: "", component: userListComponent },
      {
        path: "new/",
        canDeactivate: [userEditGuard],
        component: userComponent
      },
      {
        path: "edit/:id",
        canDeactivate: [userDetailGuard],
        component: userComponent
      }
    ])
  ],
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    userListComponent,
    userComponent
  ],
  providers: [ CustomerService, userDetailGuard, userEditGuard,],
  // entryComponents: [MatOption],
  exports: [
    userListComponent,
    userComponent

  ]
})
export class userModule { }
