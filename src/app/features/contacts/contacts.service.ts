import { inject, Injectable, signal } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  http = inject(HttpClient);
  list = signal<Contact[]>([]);

  add(contact: Contact) {
    return this.http.post<Contact>(`${environment.api}/contacts`, contact)
      .pipe(tap(res => {
        this.list.update(contacts => [...contacts, res])
      }))
  }

  update(id: string, contact: Contact) {
    return this.http.put<Contact>(`${environment.api}/contacts/${id}`, contact)
      .pipe(tap(res => {
        this.list.update(contacts => {
          const index = contacts.findIndex(contact => contact?._id === res._id)
          contacts[index] = { ...contacts[index], ...res }
          return [...contacts];
        })
      }))
  }
  
  getAll() {
    return this.http.get<Contact[]>(`${environment.api}/contacts`)
      .pipe(tap(res => {
        this.list.set(res)
      }))
  }

  delete(id: string) {
    return this.http.delete<Contact>(`${environment.api}/contacts/${id}`)
      .pipe(tap(res => {
        this.list.update(contacts => {
          return contacts.filter(contact => contact._id !== id)
        })
      }))
  }
}