import './regcompanies.js';
import './lstcompanies.js';

export class CompanyComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active mnucompany" aria-current="page" href="#" data-view="regcompanies">Registrar Compañía</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnucompany" href="#" data-view="lstcompanies">Listado de Compañías</a>
        </li>
      </ul>
      <div id="regcompanies" style="display:block;"><reg-companies></reg-companies></div>
      <div id="lstcompanies" style="display:none;"><lst-companies></lst-companies></div>
    `;
  }

  setupEventListeners() {
    // Manejo de pestañas
    this.querySelectorAll(".mnucompany").forEach(link => {
        link.addEventListener("click", (e) => this.handleTabClick(e));
    });

    // Eventos personalizados
    this.addEventListener('company-saved', () => this.switchToListView(true));
    this.addEventListener('edit-company', (e) => this.handleEditCompany(e));
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
          const listComponent = this.querySelector('lst-companies');
          if (listComponent && typeof listComponent.fetchCompanies === 'function') {
              listComponent.fetchCompanies();
          }
      }
  }
  
  switchToListView(refresh = false) {
      this.switchToView('lstcompanies', refresh);
  }

  handleEditCompany(event) {
    const companyToEdit = event.detail;
    this.switchToView('regcompanies');
    const regComponent = this.querySelector('reg-companies');
    regComponent.loadDataForEdit(companyToEdit);
  }
}

customElements.define("company-component", CompanyComponent);