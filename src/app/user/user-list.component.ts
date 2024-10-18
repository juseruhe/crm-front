import { Component, OnInit, ViewChild } from "@angular/core";


import * as _ from "lodash";
import {MatSnackBar} from '@angular/material/snack-bar';

import {MatDialog} from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmDialog } from "src/app/shared";
import { UserService } from "src/app/_services/user/userUser.service";
import { User } from "src/app/_models";
@Component({
  selector: 'order-list',
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
  providers: [ConfirmDialog]
})
export class userListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isModalOpen = false; // Control para mostrar el modal
  pageTitle: string = "Ordenes";
  users: User[] = [];  // Arreglo para almacenar los usuarios
  errorMessage: string = '';  // Variable para manejar errores
  showImage: boolean = false;
  listFilter: any = {};
  displayedColumns: string[] = [ 'firstname', 'lastname', 'email','role', 'actions'];
  dataSource: any = null; // new MatTableDataSource<Element>(ELEMENT_DATA);
  pager: any = {};
  pagedItems: any[];
  totalAmount: number;
  searchFilter: any = {
    reference: "",
    amount: "",
    quantity: ""

  };
  displayMessage: { [key: string]: string } = {};
  selectedOption: string;

  userForm: FormGroup;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }



  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [null],  // El campo ID es opcional ya que podría no ser necesario al crear un nuevo usuario.
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(200)]],
      password: ['', [Validators.required, Validators.minLength(6)]],  // Asegúrate de que el campo contraseña cumpla con los requisitos mínimos.
      roleId: [null, Validators.required],  // Este campo es obligatorio para asignar el rol.
      createdAt: [null],  // Campo opcional ya que este dato suele ser manejado automáticamente.
      updatedAt: [null],  // Campo opcional, suele actualizarse automáticamente.
    });
    

    this.searchFilter = {};
    this.listFilter = {};
    this.getUsers();
  }

  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe(
        (data) => {
            console.log('Cliente obtenido:', data); // Muestra el cliente en consola
        },
        (error) => {
            console.error('Error al obtener el cliente:', error);
        }
    );
}
 
getUsers(): void {
  this.userService.getUsers().subscribe(response => {
    if (response && response.data) {
      this.dataSource = new MatTableDataSource(response.data); // Asignamos el array 'data'
    }
  });
}

createUser(): void {
  if (this.userForm.valid) {
    this.userService.createUser(this.userForm.value).subscribe(
      response => {
        console.log('Cliente creado con éxito', response);

        // Refrescar la tabla obteniendo los usuarios de nuevo
        this.userService.getUsers().subscribe(usersResponse => {
          if (usersResponse && usersResponse.data) {
            this.dataSource.data = usersResponse.data; // Asegúrate de asignar el array 'data'
          }
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



  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500
    });
  }

  openModal() {
    this.isModalOpen = true;
}

closeModal() {
    this.isModalOpen = false;
}

openDialog(id: number) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { title: 'Confirmar eliminación', message: '¿Estás seguro de que deseas eliminar este Usuario?' }
  });

  dialogRef.disableClose = true;

  dialogRef.afterClosed().subscribe(result => {
      if (result) { // Si el usuario confirma la eliminación
          this.userService.deleteUser(id).subscribe(
              () => {
                  // Llama a loadClients para refrescar la tabla después de la eliminación
                  this.getUsers(); 

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
}
