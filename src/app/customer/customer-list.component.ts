import { Component, OnInit, ViewChild } from '@angular/core';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { PagerService } from '../_services';
import { ConfirmDialog } from '../shared';
import * as _ from 'lodash';

import {MatDialog} from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ClientService } from '../_services/client.service';


@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css'],
    providers: [ConfirmDialog]
})
export class CustomerListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

   clients: any;
    pageTitle: string = 'Clientes';
    imageWidth: number = 30;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: any = {};
    errorMessage: string;

    customers: Customer[];
    customerList: Customer[]; //
    displayedColumns = ["avatar", "firstname", "lastname", "rewards", "email", "membership", "id"];
    dataSource: any = null;
    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {
        firstname: "",
        lastname: "",
        email: ""
    };
    selectedOption: string;


    constructor(
        private customerService: CustomerService,
        // private pagerService: PagerService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
    private clientService: ClientService) {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    freshDataList(client: any) {
   //     this.customers = customer;

    //  this.dataSource = new MatTableDataSource(this.customers);
    this.dataSource = new MatTableDataSource(this.clients)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.customerService.getCustomers()
            .subscribe(customers => {
                this.freshDataList(customers);
            },
            error => this.errorMessage = <any>error);

        this.searchFilter = {};
        this.listFilter = {};

        this.getAll();
    }

    getCustomers(pageNum?: number) {
        this.customerService.getCustomers()
            .subscribe(customers => {
                this.freshDataList(customers);
            },
            error => this.errorMessage = <any>error);
    }

    searchCustomers(filters: any) {
        if (filters) {
            this.customerService.getCustomers()
                .subscribe(customers => {
                    this.customers = customers;
                    console.log(this.customers.length)
                    this.customers = this.customers.filter((customer: Customer) => {
                        let match = true;

                        Object.keys(filters).forEach((k) => {
                            match = match && filters[k] ?
                                customer[k].toLocaleLowerCase().indexOf(filters[k].toLocaleLowerCase()) > -1 : match;
                        })
                        return match;
                    });
                    this.freshDataList(customers);
                },
                error => this.errorMessage = <any>error);
        }

    }

    resetListFilter() {
        this.listFilter = {};
        this.getAll();
    }

    reset() {
        this.listFilter = {};
        this.searchFilter = {};
        this.getAll();

    }

    resetSearchFilter(searchPanel: any) {
        searchPanel.toggle();
        this.searchFilter = {};
        this.getAll();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 1500,
        });
    }

   openDialog(id: number) {
        let dialogRef = this.dialog.open(ConfirmDialog,
            { data: { title: 'Eliminar', message: 'Desea eliminar este cliente?' } });
        dialogRef.disableClose = true;


        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;

            if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
                this.clientService.delete(id).then(
                    res => {
                        this.getAll()
                        this.openSnackBar("El cliente fue eliminado éxitosamente. ", "Close");
                    })
                    .catch(err => {
                        this.errorMessage = <any>err;
                        console.log(this.errorMessage);
                        this.openSnackBar("Error al eliminar el cliente. Por favor intenta más tarde.", "Cerrar");
                    })
          
            }
        });
    }

   async getAll(){

    await this.clientService.getAll()
    .then(res =>{
        console.log(res.data);
     
        this.freshDataList(res.data)
        // Inicio iteración de avatar
        res.data.forEach(item =>{
            item.avatar =  '/assets/img/avatar5.png'
        })


        this.clients = res.data
    },err => {
        console.log(err)
    })

    }



}
