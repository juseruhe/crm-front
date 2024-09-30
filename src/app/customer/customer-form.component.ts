import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Customer } from './customer';
import { CustomerService } from './customer.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { ClientService } from '../_services/client/client.service';


@Component({
    selector: 'customer-form',
    templateUrl: './customer-form.component.html',
    styles: [`
    .title-spacer {
        flex: 1 1 auto;
      }
    .form-field{
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
    }
    .avatar-field {
        left: 0;
        margin: 0 auto;
        position: absolute;
        margin-left: 50px;
    }
    `]
})
export class CustomerFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    loading: boolean = true;
    pageTitle: string = 'Update Customer';
    errorMessage: string;
    customerForm: FormGroup;
    customer: Customer = <Customer>{};
    private sub: Subscription;
    showImage: boolean;
    imageWidth: number = 100;
    imageMargin: number = 2;
    fieldColspan = 3;
    client: any; // Variable para almacenar la información del cliente
    id: number; // Variable para almacenar el ID del cliente

    // Use with the generic validation message class
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
    };

    constructor(private fb: FormBuilder,
        private clientService: ClientService,
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService,
        private breakpointObserver: BreakpointObserver,


    ) {

        //dev julian 
        this.customerForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            mobile: [''],
            rewards: ['', Validators.required],
            membership: [false],
        });






        breakpointObserver.observe([
            Breakpoints.HandsetLandscape,
            Breakpoints.HandsetPortrait
        ]).subscribe(result => {
            // console.log(result)
            this.onScreensizeChange(result);
        });
        this.genericValidator = new GenericValidator(this.validationMessages);

    }

    //dev julian 
    loadCustomer(id: number): void {
        this.clientService.getClientById(id).subscribe(
            (response) => {
                if (response && response.data) {
                    this.customer = response.data; // Accede a los datos del cliente
                    this.customerForm.patchValue(this.customer); // Llenar el formulario
                } else {
                    console.error('No se encontró el cliente.');
                }
            },
            (error) => {
                console.error('Error fetching customer:', error);
            }
        );
    }


    loadClient(): void {
        this.clientService.getClientById(this.id).subscribe(
            (data) => {
                this.client = data; // Asigna los datos obtenidos a la variable client
            },
            (error) => {
                console.error('Error al obtener el cliente:', error); // Manejo de errores
            }
        );
    }

    ngOnInit(): void {

        //dev  julian 

           // Obtener el ID del cliente desde la ruta
           const clientId = +this.route.snapshot.paramMap.get('id')!;
           this.clientService.getClientById(clientId).subscribe(response => {
             const clientData = response.data;
             this.customerForm.patchValue(clientData);
             this.loading = false; // Cambia a false cuando los datos se cargan
           }, error => {
             console.error('Error al cargar los datos del cliente', error);
             this.loading = false; // Cambia a false incluso en caso de error
             // Maneja el error aquí
           });


        this.customerForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
            rewards: ['', NumberValidators.range(0, 150)],
            phone: ['', Validators.maxLength(12)],
            mobile: ['', Validators.maxLength(12)],
            membership: false,
        });

        // Read the customer Id from the route parameter
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getCustomer(id);
            }
        );

        this.sub.add(null);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.customerForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.customerForm);
        });
    }

    getCustomer(id: number): void {
        this.customerService.getCustomer(id)
            .subscribe(
                (customer: Customer) => this.onCustomerRetrieved(customer),
                (error: any) => this.errorMessage = <any>error
            );
    }

    onCustomerRetrieved(customer: Customer): void {
        if (this.customerForm) {
            this.customerForm.reset();
        }
        this.customer = customer;

        if (this.customer.id === 0) {
            this.pageTitle = 'New Customer';
        } else {
            this.pageTitle = `Customer: ${this.customer.firstname} ${this.customer.lastname}`;
        }

        // Update the data on the form
        this.customerForm.patchValue({
            firstname: this.customer.firstname,
            lastname: this.customer.lastname,
            email: this.customer.email,
            rewards: this.customer.rewards,
            phone: this.customer.phone,
            mobile: this.customer.mobile,
            membership: this.customer.membership
        });
    }

    

    toggleImage(): void {
        event.preventDefault();
        this.showImage = !this.showImage;
    }



    saveClient(): void {
        const clientId = +this.route.snapshot.paramMap.get('id')!;
        if (this.customerForm.valid) {
            this.clientService.updateClient(clientId, this.customerForm.value).subscribe(
                response => {
                    console.log('Cliente actualizado con éxito', response);
                    this.router.navigate(['/customers']); // Redirige a la lista de clientes inmediatamente
                },
                error => {
                    console.error('Error al actualizar el cliente', error);
                    // Opcional: Aquí puedes manejar el error de alguna manera, como mostrando un mensaje de error.
                }
            );
        }
    }



    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.customerForm.reset();
        this.router.navigate(['/customers']);
    }

    onScreensizeChange(result: any) {
        // debugger
        const isLess600 = this.breakpointObserver.isMatched('(max-width: 599px)');
        const isLess1000 = this.breakpointObserver.isMatched('(max-width: 959px)');
        console.log(
            ` isLess600  ${isLess600} 
            isLess1000 ${isLess1000}  `
        )
        if (isLess1000) {
            if (isLess600) {
                this.fieldColspan = 12;
            }
            else {
                this.fieldColspan = 6;
            }
        }
        else {
            this.fieldColspan = 3;
        }
    }
}
