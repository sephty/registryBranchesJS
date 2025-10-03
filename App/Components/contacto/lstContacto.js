
import { getContacts, deleteContacts } from '../../../Apis/contact/contactApi.js';

export class LstContacto extends HTMLElement {
  constructor() {
    super();
    this.contacts = [];
    this.render();
    this.fetchContacts();
    }

    async fetchContacts() {
    try {
      const contacts = await getContacts();
      this.contacts = Array.isArray(contacts) ? contacts : [];
      this.renderContacts();
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
    }

    render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
      @import "./App/Components/contacto/contactoStyle.css";
      </style>
      <div class="card mt-3">
      <div class="card-header">
        Listado de contactos
        <div class="float-end">
            <button class="btn btn-success btn-sm ms-2" id="refreshContactsBtn">Refresh Data</button>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-hover">
        <thead>
          <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Celular</th>
          <th>Email</th>
          <th>Residencia</th>
          <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="contact-list"></tbody>
        </table>
      </div>
      </div>
    `;
    this.querySelector('#refreshContactsBtn').addEventListener('click', this.fetchContacts.bind(this));
    }

    renderContacts() {
    const tbody = this.querySelector('#contact-list');
    if (!tbody) return;
    tbody.innerHTML = this.contacts.map(contact => `
      <tr data-id="${contact.id || ''}">
      <td>${contact.id || ''}</td>
      <td>${contact.nombreContacto || ''}</td>
      <td>${contact.apellidoContacto || ''}</td>
      <td>${contact.nroCelular || ''}</td>
      <td>${contact.emailContacto || ''}</td>
      <td>${contact.nroResidencia || ''}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-contact-btn" data-id="${contact.id || ''}">Edit</button>
        <button class="btn btn-danger btn-sm delete-contact-btn" data-id="${contact.id || ''}">Delete</button>
      </td>
      </tr>
    `).join('');

    this.querySelectorAll('.edit-contact-btn').forEach(button => {
        button.addEventListener('click', this.handleEditClick.bind(this));
    });
    this.querySelectorAll('.delete-contact-btn').forEach(button => {
        button.addEventListener('click', this.handleDeleteClick.bind(this));
    });
    }

    handleEditClick(event) {
        const contactId = event.target.dataset.id;
        const contactToEdit = this.contacts.find(contact => String(contact.id) === String(contactId));
        if (contactToEdit) {
            this.dispatchEvent(new CustomEvent('editContact', {
                bubbles: true,
                composed: true,
                detail: contactToEdit
            }));
        } else {
            console.warn('Contact not found for editing:', contactId);
        }
    }

    async handleDeleteClick(event) {
        const contactId = event.target.dataset.id;
        if (confirm(`Are you sure you want to delete contact with ID: ${contactId}?`)) {
            try {
                const response = await deleteContacts(contactId); 
                if (response.ok) {
                    this.contacts = this.contacts.filter(c => String(c.id) !== String(contactId));
                    this.renderContacts();
                    console.log('Deleted contact from API:', contactId);
                    this.dispatchEvent(new CustomEvent('contactDeleted', { bubbles: true, composed: true, detail: { id: contactId } }));
                } else {
                    console.error('Failed to delete contact:', contactId, await response.text());
                    alert('Failed to delete contact on server.');
                }
            } catch (error) {
                console.error('Error deleting contact:', error);
                alert('Error deleting contact.');
            }
        }
    }
}

customElements.define('lst-contacto', LstContacto);