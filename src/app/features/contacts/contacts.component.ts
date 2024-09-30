import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Contact } from './contact.model';
import { ContactsService } from './contacts.service';
import { ContactFormDialogComponent } from './contact-form-dialog/contact-form-dialog.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './contacts.component.html',
  styles: ``
})
export class ContactsComponent {
  dialog = inject(MatDialog);
  contactsService = inject(ContactsService)
  displayedColumns: string[] = ['name', 'phone', 'email', 'actions'];
  
  ngOnInit(): void {
    this.contactsService.getAll().subscribe()
  }

  onCreateForm() {
    this.dialog.open(ContactFormDialogComponent, {
      width: '320px',
    })
  }

  onEditForm(contact: Contact) {
    this.dialog.open(ContactFormDialogComponent, {
      width: '320px',
      data: {
        contact
      }
    })
  }

  onDelete(id: string) {
    this.contactsService.delete(id).subscribe()
  }
}

