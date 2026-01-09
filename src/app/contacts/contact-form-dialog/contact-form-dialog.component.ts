import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';
import {MatTelInput} from 'mat-tel-input'

@Component({
    selector: 'app-contact-form-dialog',
    imports: [ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose, MatInputModule, MatFormFieldModule, MatTelInput],
    templateUrl: './contact-form-dialog.component.html'
})
export class ContactFormDialogComponent {
  dialogRef = inject(MatDialogRef<ContactFormDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  formBuilder = inject(NonNullableFormBuilder)

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  })
  private contactService = inject(ContactsService)

  constructor() {
    if (this.data?.contact) {
      this.form.patchValue({
        ...this.data.contact
      })
    }
  }

  onSave() {
    const contact: Contact = this.form.getRawValue()
    const id = this.data?.contact?._id
    const request = id ? this.contactService.update(id, contact) : this.contactService.add(contact);
    request.subscribe(() => {
      this.dialogRef.close()
    })
  }
}