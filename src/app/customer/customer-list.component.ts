import { Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { PagerService } from '../_services';
import { ConfirmDialog, GenericValidator, NumberValidators } from '../shared';
import * as _ from 'lodash';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ClientService } from '../_services/client/client.service';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../interface/client.model';
import { Observable } from 'rxjs';


@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css'],
    providers: [ConfirmDialog]
})
export class CustomerListComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayMessage: { [key: string]: string } = {};
    private genericValidator: GenericValidator;

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    private validationMessages: { [key: string]: { [key: string]: string } | {} } = {
        firstname: {
            required: 'Customer first name is required.',
            minlength: 'Customer first name must be at least one characters.',
            maxlength: 'Customer first name cannot exceed 100 characters.'
        },
        lastname: {
            required: 'Customer last name is required.',
            minlength: 'Customer last name must be at least one characters.',
            maxlength: 'Customer last name cannot exceed 100 characters.'
        },
        email: {
            required: 'Customer email is required.',
            minlength: 'Customer email must be at least one characters.',
            maxlength: 'Customer email cannot exceed 200 characters.'
        },
        rewards: {
            range: 'Rewards of the customer must be between 0 (lowest) and 150 (highest).'
        },
        phone: { maxlength: 'Customer phone cannot exceed 12 characters.' },
        mobile: { maxlength: 'Customer mobile cannot exceed 12 characters.' },
    }
    customerForm: FormGroup;
    isModalOpen = false; // Control para mostrar el modal

    pageTitle: string = 'Clientes';
    imageWidth: number = 30;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: any = {};
    errorMessage: string;

    customers: Customer[];
    customerList: Customer[]; //

    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {
        firstname: "",
        lastname: "",
        email: ""
    };
    selectedOption: string;
    // Array para almacenar los clientes
    displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'mobile', 'rewards', 'membership', 'actions']; // Definición de las columnas
    // Fuente de datos para la tabla
    fieldColspan: 3;
  
    dataSource: MatTableDataSource<Client>; // Suponiendo que Client es el tipo correcto
    clients: Client[] = [];


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private clientService: ClientService,
        private customerService: CustomerService,
        // private pagerService: PagerService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
            this.customerForm = this.fb.group({
                firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
                rewards: ['', NumberValidators.range(0, 150)],
                phone: ['', Validators.maxLength(12)],
                mobile: ['', Validators.maxLength(12)],
                membership: false,
            });
    }

    //dev julian 


    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.customerForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.customerForm);
        });
    }


    loadClients(): void {
        this.clientService.getClients().subscribe(
            (data) => {
                this.clients = data; // Asigna los datos obtenidos a la variable clients
                this.dataSource = new MatTableDataSource(this.clients); // Inicializa MatTableDataSource con los datos
            },
            (error) => {
                console.error('Error al obtener los clientes:', error); // Manejo de errores
            }
        );
    }

    
    getClientById(id: number): void {
        this.clientService.getClientById(id).subscribe(
            (data) => {
                console.log('Cliente obtenido:', data); // Muestra el cliente en consola
            },
            (error) => {
                console.error('Error al obtener el cliente:', error);
            }
        );
    }

    // Método para eliminar un cliente
openDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
        data: { title: 'Confirmar eliminación', message: '¿Estás seguro de que deseas eliminar este elemento?' }
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
        if (result) { // Si el usuario confirma la eliminación
            this.clientService.deleteClient(id).subscribe(
                () => {
                    // Llama a loadClients para refrescar la tabla después de la eliminación
                    this.loadClients(); 

                    // Muestra un mensaje de éxito
                    this.openSnackBar("El elemento se ha eliminado con éxito.", "Cerrar");
                },
                (error: any) => {
                    this.errorMessage = <any>error;
                    console.log(this.errorMessage);
                    this.openSnackBar("Este elemento no se ha eliminado con éxito. Por favor, intenta de nuevo.", "Cerrar");
                }
            );
        }
    });
}



    //plantilla 
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        // this.dataSource.filter = filterValue;
    }

    freshDataList(customers: Customer[]) {
        this.customers = customers;

        //  this.dataSource = new MatTableDataSource(this.customers);
        // this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
    }





    ngOnInit(): void {

        //dev julian 
        this.loadClients();
        this.customerForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
            rewards: ['', NumberValidators.range(0, 150)],
            phone: ['', Validators.maxLength(12)],
            mobile: ['', Validators.maxLength(12)],
            membership: false,
        });







        //plantilla 
        this.customerService.getCustomers()
            .subscribe(customers => {
                this.freshDataList(customers);
            },
                error => this.errorMessage = <any>error);

        this.searchFilter = {};
        this.listFilter = {};
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
        this.getCustomers();
    }

    reset() {
        this.listFilter = {};
        this.searchFilter = {};
        this.getCustomers();

    }

    resetSearchFilter(searchPanel: any) {
        searchPanel.toggle();
        this.searchFilter = {};
        this.getCustomers();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 1500,
        });
    }


    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    createClient(): void {
        if (this.customerForm.valid) {
            this.clientService.createClient(this.customerForm.value).subscribe(
                response => {
                    console.log('Cliente creado con éxito', response);

                    // Refrescar la tabla obteniendo los clientes de nuevo
                    this.clientService.getClients().subscribe(clients => {
                        this.dataSource.data = clients; // Actualiza el dataSource con los nuevos datos
                    });

                    // Cerrar el modal
                    this.closeModal();
                },
                error => {
                    console.error('Error al crear el cliente', error);
                }
            );
        }
    }



}

