import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChildren,
    ElementRef,
  
  } from "@angular/core";
  import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControlName,
  
  } from "@angular/forms";
  import { ActivatedRoute, Router } from "@angular/router";
  
  import "rxjs/add/operator/debounceTime";
  import "rxjs/add/observable/fromEvent";
  import "rxjs/add/observable/merge";
  import { Observable } from "rxjs/Observable";
  import { Subscription } from "rxjs/Subscription";
  

  

  import { MatDialog } from '@angular/material/dialog';

  import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService } from "src/app/_services/user/userUser.service";
import { CustomerService } from "src/app/customer";
import { ProductDialogComponent, OrderService } from "src/app/order";
import { IOrder } from "src/app/order/order";
import { GenericValidator } from "src/app/shared";
import { Customer } from "./user";

  
  @Component({
    selector: 'order-form',
    templateUrl: "./user-form.component.html",
    styles: [`
    .title-spacer {
        flex: 1 1 auto;
      }
    .form-field{
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
      }
      `],
    providers: [ProductDialogComponent]
  })
  export class userComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements: ElementRef[];

    errorMessage: string;
    userForm: FormGroup;
    showImage: boolean;
    customers: Customer[];
    loading: boolean = true;
    fieldColspan = 4;
    // Use with the generic validation messcustomerId class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } } = {
      reference: {
        required: "Order reference is required.",
        minlength: "Order reference must be at least one characters.",
        maxlength: "Order reference cannot exceed 100 characters."
      },
      amount: {
        required: "Order amount is required.",
        range:
          "Amount of the order must be between 1 (lowest) and 9999 (highest)."
      },
      quantity: {
        required: "Order quantity is required.",
        range:
          "Quantity of the order must be between 1 (lowest) and 20 (highest)."
      },
      customerId: {
        required: "Customer is required."
      }
    };
    private sub: Subscription;
    private genericValidator: GenericValidator;

  
  
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private customerService: CustomerService,
      public dialog: MatDialog,
      private breakpointObserver: BreakpointObserver,
      private userService: UserService,
    ) {
      /*
      breakpointObserver.observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]).subscribe(result => {
        this.onScreensizeChange();
      });
      */
  
      this.genericValidator = new GenericValidator(this.validationMessages);
    }
  
    ngOnInit(): void {
      this.userForm = this.fb.group({
        id: [null],
        firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(200)]],
        password: ['', [Validators.minLength(6)]],
        roleId: [null, Validators.required],
        phone: ['', [Validators.minLength(7), Validators.maxLength(15)]],  // Añadir este campo
        mobile: ['', [Validators.minLength(7), Validators.maxLength(15)]], // Añadir este campo
        rewards: [null],
        membership: [false]
      });


      const clientId = +this.route.snapshot.paramMap.get('id')!;
      this.userService.getUserById(clientId).subscribe(response => {
        const clientData = response.data;
        this.userForm.patchValue(clientData);
        this.loading = false; // Cambia a false cuando los datos se cargan
      }, error => {
        console.error('Error al cargar los datos del cliente', error);
        this.loading = false; // Cambia a false incluso en caso de error
        // Maneja el error aquí
      });
    }
  
    ngOnDestroy(): void {
      this.sub.unsubscribe();
    }
  
    ngAfterViewInit(): void {
      
    }
  
  
   
  
  
  
    saveUser(): void {
      const id = +this.route.snapshot.paramMap.get('id')!;
      if (this.userForm.valid) {
          this.userService.updateUser(id, this.userForm.value).subscribe(
              response => {
                  console.log('Usuario actualizado con éxito', response);
                  this.router.navigate(['/user']); // Redirige a la lista de usuarios inmediatamente
              },
              error => {
                  console.error('Error al actualizar el usuario', error);
                  // Puedes mostrar un mensaje de error al usuario, si lo deseas
                  // Por ejemplo, usando un servicio de notificaciones
              }
          );
      } else {
          console.error('El formulario no es válido', this.userForm.errors);
          // Puedes mostrar un mensaje de error si el formulario no es válido
      }
  }
  
  

    
  
  }
  