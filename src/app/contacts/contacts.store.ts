import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Contact } from './contact.model';
import { computed, inject } from '@angular/core';
import { ContactsService } from './contacts.service';
import { pipe, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';

interface ContactsState {
    contacts: Contact[];
    isLoading: boolean;
};

const initialState: ContactsState = {
    contacts: [],
    isLoading: false,
};

export const ContactsStore = signalStore(
    { providedIn: 'root' },
    withDevtools('contacts'),
    withState(initialState),

    withComputed(({ contacts }) => ({
        contactsCount: computed(() => contacts().length),
    })),

    withMethods((store, contactsService = inject(ContactsService)) => ({
        getAll: rxMethod<void>(
            pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => updateState(store, 'GET_CONTACTS', { isLoading: true })),
                switchMap(() => {
                    return contactsService.getAll().pipe(
                        tapResponse({
                            next: (contacts) =>
                                updateState(store, 'GET_CONTACTS_SUCCESS', { contacts, isLoading: false }),
                            error: () => {
                                updateState(store, 'GET_CONTACTS_ERROR', { isLoading: false });
                            },
                        })
                    );
                })
            )
        ),
        add(contact: Contact) {
            updateState(store, 'ADD_CONTACT', { isLoading: true })
            return contactsService.add(contact).pipe(
                tapResponse({
                    next: (res) => {
                        const contacts = [...store.contacts(), res]
                        updateState(store, 'ADD_CONTACT_SUCCESS', { contacts, isLoading: false })
                    },
                    error: () => {
                        updateState(store, 'ADD_CONTACT_ERROR', { isLoading: false });
                    },
                })
            );
        },
        update(id: string, contact: Contact) {
            updateState(store, 'UPDATE_CONTACT', { isLoading: true })
            return contactsService.update(id, contact).pipe(
                tapResponse({
                    next: (res) => {
                        const contacts = [...store.contacts()]
                        const index = contacts.findIndex(contact => contact?._id === res._id)
                        contacts[index] = { ...contacts[index], ...res }
                        updateState(store, 'UPDATE_CONTACT_SUCCESS', { contacts, isLoading: false })
                    },
                    error: () => {
                        updateState(store, 'UPDATE_CONTACT_ERROR', { isLoading: false });
                    },
                })
            );
        },
        delete: rxMethod<string>(
            pipe(
                tap(() => updateState(store, 'DELETE_CONTACT', { isLoading: true })),
                switchMap((id) => {
                    return contactsService.delete(id).pipe(
                        tapResponse({
                            next: () => {
                                const updatedContacts = [...store.contacts()].filter(contact => contact._id !== id);
                                updateState(store, 'DELETE_CONTACT_SUCCESS', { contacts: updatedContacts, isLoading: false })
                            },
                            error: () => {
                                updateState(store, 'DELETE_CONTACT_ERROR', { isLoading: false });
                            },
                        })
                    );
                })
            )
        ),

    }))
);