import './regcountries.js';
import './lstcountries.js';

export class CountryComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link class="card mt-3">
        <div class="card-header">Listado de Regiones
            <button class="btn btn-info btn-sm float-end" id="refresh-btn">Refrescar</button>
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead><tr><th>ID</th><th>Nombre</th><th>País ID</th><th>Acciones</th></tr></thead>
            <tbody id="region-list"></tbody>
          </table>
        </div>
      </div>
    `;
    this.querySelector('#refresh-btn').addEventListener('click', () => this.fetchRegions());
  }

  renderTable() {
    const tbody = this.querySelector('#region-list');
    tbody.innerHTML = '';
    this.regions.forEach(region => {
        const row = document.createElement('tr');
        row.dataset.id = region.id;
        row.innerHTML = `
            <td>${region.id}</td>
            <td>${region.name || ''}</td>
            <td>${region.CountryId || ''}</td>
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
            const regionId = e.target.closest('tr').dataset.id;
            if (e.target.classList.contains('edit-btn')) {
                const region = this.regions.find(r => String(r.id) === regionId);
                this.dispatchEvent(new CustomEvent('edit-region', { bubbles: true, composed: true, detail: region }));
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteRegion(regionId);
            }
        });
    });
  }

  async deleteRegion(id) {
      if (confirm(`¿Eliminar la región con ID ${id}?`)) {
          const response = await deleteRegions(id);
          if(response && response.ok) { this.fetchRegions(); }
          else { alert("Error al eliminar la región."); }
      }
  }
}
customElements.define('lst-regions', LstRegions);