import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { timer } from 'rxjs';
import {UrlService} from '../_services/url.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {

  isModalVisible = false;

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

    /* Header page */
    headerPage = {
      icon: 'group_add',
      title: 'Sitios'
    };
  
    siteStatus: 'up' | 'down' | 'error' | 'unknown' | '' = '';
    siteUrl = '';
    form: FormGroup
    loading = false;
    showAlert = false;
    links: any[] = [];
    linkNames: any[] = [];
    linkResponse: any[] = [];
   // panelOpenState = false;
   // dataSource: any
   // dataSource2: any
   // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
   dateToday = new Date();
  
    constructor(private http: HttpClient,
      private sitesService: UrlService
      ) {
        this.form = new FormGroup({
        url: new FormControl('', Validators.required)
        })
      
      }
  
  
  
   async ngOnInit(){
  
   await this.getUrls();
   await this.sendUrls()
    }
  
  
   async insertURL(){
   /* if(this.form.valid){
      this.siteUrl = this.form.value.url;
  
    this.loading = true;
  
     this.sendUrl();
  
    }else {
  
    }*/
  
  
    if(this.links.length > 0){
      this.linkResponse = []
      this.loading = true;
     await this.sendUrls()
    }else{
  
    }
    
    }
  
  
  
   async sendUrl(){
     
     
    await  this.sitesService.sendUrl(this.siteUrl)
     .then(res => {
  
     this.loading = false
  
     this.siteStatus = "up"
  
  
     
     }).catch(err => {
      this.loading = false
  
      
  
      if(err.status === 500){
        
       this.siteStatus = "down"
      }
     })
  
    }
  
    showTemporaryAlert() {
      this.showAlert = true; // Mostrar la alerta
      timer(3000).subscribe(() => {
        // Ocultar la alerta después de 3 segundos
        this.showAlert = false;
      });
  
    }
  
  async  addUrls(url: string) {
     // this.links.push(url)
  
     if(url != "" || url != null || url != ""){
      this.loading = true;
    await this.sitesService.addUrl(url)
     .then(res => {
      console.log(res)
      this.loading = false
     this.getUrls()
     }).catch(err => {
      console.log(err)
     })
    }
     
    }
  
  
   async sendUrls(){
  
      this.linkNames = []
     
      this.links.forEach(element => {
        
        this.linkNames.push(element.name)
        })
  
     await this.sitesService.sendUrls(this.linkNames)
      .then(res => {
   
      this.loading = false
   
      console.log(res?.results)
        localStorage.setItem('sitios', JSON.stringify(res?.results))
   //   this.dataSource2 = new MatTableDataSource<any>(res.results)
    //  this.dataSource2.paginator 
  
   for(let i=0; i<res?.results.length; i++) {
      this.linkResponse.push(res?.results[i])
   }
  
  
      } ).catch(err => {
        this.loading = false
    
        console.log(err)
    
        if(err.status === 500){
          
      
        }
        
    
       })
  
   
     }
  
  
     clean(){
      this.links.length > 0 ? this.links = [] : this.links
     }
  
  
  async getUrls(){
    
     await this.sitesService.getUrls()
      .then(res => {
        console.log(res?.results)
        this.links = res?.results
     //   this.dataSource = new MatTableDataSource<any>(res.results)
      }).catch(err => {
        console.log(err)
      })
    }
  
  // TABLE ANGULAR MATERIAL
    displayedColumns: string[] = ['position', 'name','details'];
    displayedColumns2: string[] = ['url','status','sslExpiration']
  
   async deleteUrl(id: number){
      const confirmed = confirm("¿Estás seguro de que quieres eliminar esta url?");
  
      // Verificar la respuesta del usuario
      if (confirmed) {
       await this.sitesService.deleteUrl(id)
      .then(res => {
        console.log(res)
      this.getUrls()
      }).catch(err => {
        console.log(err)
      })
  
      } else {
       
      }
    
    
  
    }
  
   async editUrl(name: string, id: number){
     await this.sitesService.editUrl(id,name)
      .then(res => {
        console.log(res)
        this.getUrls()
      }).catch(err =>{
        console.log(err)
      })
    }
  
  convertToDate(date: any): Date{
   return new Date(date);
  }

}
