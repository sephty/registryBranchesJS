import '/App/Components/contacto/regContacto.js';
import '/App/Components/contacto/lstContacto.js';

export class ContactoComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active mnucontacto" aria-current="page" href="#" data-view="regContacto">Registrar Contacto</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnucontacto" href="#" data-view="lstContacto">Listado de Contactos</a>
        </li>
      </ul>
      <div id="regContacto" style="display:block;"><reg-contacto></reg-contacto></div>
      <div id="lstContacto" style="display:none;"><lst-contacto></lst-contacto></div>
    `;
  }

  setupEventListeners() {
    this.querySelectorAll(".mnucontacto").forEach(link => {
        link.addEventListener("click", (e) => this.handleTabClick(e));
    });
    this.addEventListener('contacto-saved', () => this.switchToListView(true));
    this.addEventListener('edit-contacto', (e) => this.handleEditContacto(e));
  }

  handleTabClick(e) {
      e.preventDefault();
      const viewId = e.target.dataset.view;
      this.switchToView(viewId);
  }
  
  switchToView(viewId, refreshList = false) {
      this.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      this.querySelectorAll('div[id]').forEach(div => div.style.display = 'none');

      const activeLink = this.querySelector(`[data-view="${viewId}"]`);
      if (activeLink) activeLink.classList.add('active');
      const activeDiv = this.querySelector(`#${viewId}`);
      if (activeDiv) activeDiv.style.display = 'block';

      if (refreshList) {
          const listComponent = this.querySelector('lst-contacto');
          if (listComponent && typeof listComponent.fetchContactos === 'function') {
              listComponent.fetchContactos();
          }
      }
  }
  
  switchToListView(refresh = false) {
      this.switchToView('lstContacto', refresh);
  }

  handleEditContacto(event) {
    const contactoToEdit = event.detail;
    this.switchToView('regContacto');
    const regComponent = this.querySelector('reg-contacto');
    regComponent.loadDataForEdit(contactoToEdit);
  }
}

customElements.define("contacto-component", ContactoComponent);