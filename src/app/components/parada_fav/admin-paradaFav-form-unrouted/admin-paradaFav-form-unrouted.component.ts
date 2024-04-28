import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IParadaFav, IResultApi, IUser, formOperation } from '../../../model/model.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminUserSelectionUnroutedComponent } from '../../user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { AdminParadaSelectionUnroutedComponent } from '../../parada/admin-parada-selection-unrouted/admin-parada-selection-unrouted.component';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-admin-paradaFav-form-unrouted',
  templateUrl: './admin-paradaFav-form-unrouted.component.html',
  styleUrls: ['./admin-paradaFav-form-unrouted.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AdminUserSelectionUnroutedComponent
   
  ],
})
export class AdminParadaFavFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit
  paradaFavForm!: FormGroup;
  oResultApi: IResultApi = { id_parada: {}} as IResultApi;
  oParadaFav: IParadaFav = { user: { username:""} } as IParadaFav;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  showErrorOnClose: boolean = false;
  paradaExistsOnUser: boolean = false;
  denominacion: string = "";

  lostFocus = {
    alias: false,
    id_parada: false,
    user: false,

  }
  constructor(
    private oFormBuilder: FormBuilder,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    private oRouter: Router,
    private oMessageService: MessageService,
    public oDialogService: DialogService
  ) {
    this.initializeForm(this.oParadaFav);
   }


   //todo
   initializeForm(oParadaFav: IParadaFav) {
    let idParadaValidator = null;
    if (this.operation !== 'EDIT') {
      idParadaValidator = this.idParadaValidator(); // Solo aplicar el validador en caso de que no sea una operación de edición
    }
  
    this.paradaFavForm = this.oFormBuilder.group({
      id: [oParadaFav.id],
      alias: [oParadaFav.alias, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      id_parada: [oParadaFav.id_parada, [Validators.required], idParadaValidator], // Aplicar el validador solo si no es una operación de edición
      user: this.oFormBuilder.group({
        id: [oParadaFav.user.id],

      })
    });
  }
  ngOnInit() {
   
    if (this.operation == 'EDIT') {
      this.oParadaFavAjaxService.getOne(this.id).subscribe({
        next: (data: IParadaFav) => {
          this.oParadaFav = data;
          this.initializeForm(this.oParadaFav);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMessageService.add({ severity: 'error', summary: 'Error', life: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oParadaFav);
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.paradaFavForm.controls[controlName].hasError(errorName);
  }
  onSubmit() {
    console.log(this.paradaFavForm.value);
    if (this.paradaFavForm.valid) {
      if (this.operation == 'NEW') {
        this.oParadaFavAjaxService.newOne(this.paradaFavForm.value).subscribe({
          next: (data: IParadaFav) => {
            this.oParadaFav = { "user": {} } as IParadaFav;
            this.initializeForm(this.oParadaFav);
            this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'Parada favorita afegida amb èxit' });
            this.oRouter.navigate(['/admin', 'paradaFav', 'view', data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
          
            this.oMessageService.add({ severity: 'error', summary:'Error', detail: 'No s\'ha pogut crear la parada favorita', life: 2000 });
          }
        });
      } else {
        this.oParadaFavAjaxService.updateOne(this.paradaFavForm.value).subscribe({
          next: (data: IParadaFav) => {
            this.oParadaFav = data;
            this.initializeForm(this.oParadaFav);
            this.oMessageService.add({ severity: 'success',summary: 'Èxit', detail: 'S\'ha actualitzat la parada favorita', life: 2000 });
            this.oRouter.navigate(['/admin', 'paradaFav', 'view', this.oParadaFav.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary:'Error',detail: 'No s\'ha pogut actualitzar la parada favorita', life: 2000 });
          }
        });
      }
    }
  }



    onShowUsersSelection() {
     this.showErrorOnClose = true;
  
    this.oDynamicDialogRef = this.oDialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'User Selection',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    }
    
    );

    this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
      this.showErrorOnClose = false;
      if (oUser) {
        this.oParadaFav.user = oUser;
        this.paradaFavForm.controls['user'].patchValue({ id: oUser.id })
        this.lostFocus.user = false; 
        this.paradaFavForm.get('id_parada')?.enable();
           // Suscripción a paradaExists() después de seleccionar un usuario
      this.paradaExists().subscribe(exists => {
        this.paradaExistsOnUser = exists;
      });
      console.log("paradaExistsOnUser:", this.paradaExistsOnUser);
      }else{
        this.lostFocus.user = true; 
      }
      
    });

    
  } 


  onShowParadasSelection() {
    this.showErrorOnClose = true;
  
    this.oDynamicDialogRef = this.oDialogService.open(AdminParadaSelectionUnroutedComponent, {
      header: 'Selecció d\'una parada d\'autobús',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((oResultApi: IResultApi) => {
      this.showErrorOnClose = false;
      
      if (oResultApi) {

        this.oResultApi = oResultApi;
        this.paradaFavForm.controls['id_parada'].patchValue(oResultApi.id_parada);
        this.denominacion = oResultApi.denominacion;
      

        this.lostFocus.id_parada = false; 
        this.paradaExists().subscribe(exists => {
          this.paradaExistsOnUser = exists;
        });
      }else{
        this.lostFocus.id_parada = true; 
      }
    });


  }



  //validator
  idParadaValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const idParada = this.oResultApi.id_parada;
      const userId = this.paradaFavForm.get('user.id')?.value;
  
      console.log("idParada:", idParada, "userId:", userId);  
  
      if (idParada !== null && userId !== null) {
        return this.validateParadaFavExists(idParada, userId)
          .pipe(
            map((exists: boolean) => (exists ? { idParadaExists: true } : null)),
            catchError(() => of(null))
          );
      }
      return of(null);
    };
  }

//para mostrar error devuelve booleano
  paradaExists(): Observable<boolean> {
    const idParada = this.oResultApi.id_parada;
    const userId = this.paradaFavForm.get('user.id')?.value;
    if (idParada !== null && userId !== null) {
      return this.validateParadaFavExists(idParada, userId)
        .pipe(
          map((exists: boolean) => exists),
          catchError(() => of(false))
        );
    }
  
    // Si no se cumplen las condiciones, devolver falso
    return of(false);
  }
  //Valida si existe la parada en el usuario
  validateParadaFavExists(idParada: number, userId: number): Observable<boolean> {
    console.log("idParada1234:", idParada);

    return this.oParadaFavAjaxService.checkParadaFavExistsForUser(idParada, userId)
      .pipe(
        map(result => !!result), // Convertir el resultado en un booleano
        catchError(() => of(false)) 
      );
  }
}
