import { getCities, deleteCities } from '../../../Apis/city/cityApi.js';

export class LstCities extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.fetchCities();
  }

  async fetchCities() {
    this.cities = await getCities();
    this.renderTable();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="card mt-3">
        <div class="card-header">Listado de Ciudades
            <button class="btn btn-info btn-sm float-end" id="refresh-btn">Refrescar</button>
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead><tr><th>ID</th><th>Nombre</th><th>Región ID</th><th>Acciones</th></tr></thead>
            <tbody id="city-list"></tbody>
          </table>
        </div>
      </div>
    `;
    this.querySelector('#refresh-btn').addEventListener('click', () => this.fetchCities());
  }

  renderTable() {
    const tbody = this.querySelector('#city-list');
    tbody.innerHTML = '';
    this.cities.forEach(city => {
        const row = document.createElement('tr');
        row.dataset.id = city.id;
        row.innerHTML = `
            <td>${city.id}</td>
            <td>${city.name || ''}</td>
            <td>${city.RegionId || ''}</td>
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
    this.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cityId = e.target.closest('tr').dataset.id;
            if (e.target.classList.contains('edit-btn')) {
                const city = this.cities.find(c => String(c.id) === cityId);
                this.dispatchEvent(new CustomEvent('edit-city', { bubbles: true, composed: true, detail: city }));
            } else {
                this.deleteCity(cityId);
            }
        });
    });
  }

  async deleteCity(id) {
      if (confirm(`¿Eliminar la ciudad con ID ${id}?`)) {
          const response = await deleteCities(id);
          if (response && response.ok) {
              this.fetchCities();
          } else {
              alert("Error al eliminar la ciudad.");
          }
      }
  }
}
customElements.define('lst-cities', LstCities);