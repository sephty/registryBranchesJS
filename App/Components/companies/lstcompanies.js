import { getCompanies, deleteCompanies } from '../../../Apis/company/companyApi.js';

export class LstCompanies extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.fetchCompanies();
  }

  async fetchCompanies() {
    this.companies = await getCompanies();
    this.renderTable();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="card mt-3">
        <div class="card-header">Listado de Compañías
            <button class="btn btn-info btn-sm float-end" id="refresh-btn">Refrescar</button>
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Dirección</th><th>Email</th><th>Ciudad ID</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody id="company-list"></tbody>
          </table>
        </div>
      </div>
    `;
    this.querySelector('#refresh-btn').addEventListener('click', () => this.fetchCompanies());
  }

  renderTable() {
    const tbody = this.querySelector('#company-list');
    tbody.innerHTML = ''; // Limpiar la tabla antes de renderizar
    this.companies.forEach(company => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', company.id);
        row.innerHTML = `
            <td>${company.id}</td>
            <td>${company.name || ''}</td>
            <td>${company.address || ''}</td>
            <td>${company.email || ''}</td>
            <td>${company.CityId || ''}</td>
            <td>
              <button class="btn btn-warning btn-sm edit-btn">Editar</button>
              <button class="btn btn-danger btn-sm delete-btn">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    this.attachRowEvents();
  }

  attachRowEvents() {
    this.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const companyId = e.target.closest('tr').dataset.id;
            const company = this.companies.find(c => String(c.id) === companyId);
            this.dispatchEvent(new CustomEvent('edit-company', { bubbles: true, composed: true, detail: company }));
        });
    });
    this.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const companyId = e.target.closest('tr').dataset.id;
            if (confirm(`¿Estás seguro de que quieres eliminar la compañía con ID ${companyId}?`)) {
                const response = await deleteCompanies(companyId);
                if(response && response.ok) { this.fetchCompanies(); }
                else { alert("Error al eliminar la compañía."); }
            }
        });
    });
  }
}
customElements.define('lst-companies', LstCompanies);