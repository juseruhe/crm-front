import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule,FormsModule } from "@angular/forms";



import { UrlService } from "../_services/url.service";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material.module";
import { SitesComponent } from "./sites.component";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild([
      { path: "", component: SitesComponent },
   
    ])
  ],
  declarations: [
    /**
     * Components / Directives/ Pipes
     */

  ],
  providers: [UrlService ],
  exports: [

  ]
})
export class SitesModule { }
