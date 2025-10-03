import { getCountries, deleteCountries } from '../../../Apis/country/countryApi.js';

export class LstCountries extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.fetchCountries();
  }

  async fetchCountries() {
    this.countries = await getCountries();
    this.renderTable();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="card mt-3">
        <div class="card-header">Listado de Países
            <button class="btn btn-info btn-sm float-end" id="refresh-btn">Refrescar</button>
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody id="country-list"></tbody>
          </table>
        </div>
      </div>
    `;
    this.querySelector('#refresh-btn').addEventListener('click', () => this.fetchCountries());
  }

  renderTable() {
    const tbody = this.querySelector('#country-list');
    tbody.innerHTML = '';
    this.countries.forEach(country => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', country.id);
        row.innerHTML = `
            <td>${country.id}</td>
            <td>${country.name || ''}</td>
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
            const countryId = e.target.closest('tr').dataset.id;
            const country = this.countries.find(c => String(c.id) === countryId);
            this.dispatchEvent(new CustomEvent('edit-country', { bubbles: true, composed: true, detail: country }));
        });
    });
    this.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const countryId = e.target.closest('tr').dataset.id;
            if (confirm(`¿Eliminar el país con ID ${countryId}?`)) {
                const response = await deleteCountries(countryId);
                if(response && response.ok) { this.fetchCountries(); }
                else { alert("Error al eliminar el país."); }
            }
        });
    });
  }
}
customElements.define('lst-countries', LstCountries);