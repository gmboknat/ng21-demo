import { inject, Injectable, signal } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  http = inject(HttpClient);
  list = signal<Contact[]>([]);

  add(contact: Contact) {
    return this.http.post<Contact>(`${environment.api}/contacts`, contact)
  }

  update(id: string, contact: Contact) {
    return this.http.put<Contact>(`${environment.api}/contacts/${id}`, contact)
  }
  
  getAll() {
    return this.http.get<Contact[]>(`${environment.api}/contacts`)
  }

  delete(id: string) {
    return this.http.delete<Contact>(`${environment.api}/contacts/${id}`)
  }
}