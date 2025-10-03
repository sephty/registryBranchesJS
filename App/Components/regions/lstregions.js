import { getRegions, deleteRegions } from '../../../Apis/region/regionApi.js';

export class lstregions extends HTMLElement {
  constructor() {
    super();
    this.regions = [];
    this.render();
    this.fetchRegions();
  }

  async fetchRegions() {
    try {
      const regions = await getRegions();
      this.regions = Array.isArray(regions) ? regions : [];
      this.renderRegions();
    } catch (error) {
      console.error('Error fetching regions:', error);
      alert('Failed to fetch regions. Please check your network connection or try again later.');
    }
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
      @import "./App/Components/regions/regionStyle.css";
      </style>
      <div class="card mt-3">
        <div class="card-header">
          Listado de Regiones
          <div class="float-end">
            <button class="btn btn-success btn-sm ms-2" id="syncDataBtn">Sync Data</button>
          </div>
        </div>
        <div class="card-body">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="region-list"></tbody>
          </table>
        </div>
      </div>
    `;
    this.querySelector('#syncDataBtn').addEventListener('click', this.fetchRegions.bind(this));
  }

  renderRegions() {
    const tbody = this.querySelector('#region-list');
    if (!tbody) return;
    tbody.innerHTML = this.regions.map(region => `
      <tr data-id="${region.id || ''}">
        <td>${region.name || ''}</td>
        <td>${region.description || ''}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-region-btn" data-id="${region.id || ''}">Edit</button>
          <button class="btn btn-danger btn-sm delete-region-btn" data-id="${region.id || ''}">Delete</button>
        </td>
      </tr>
    `).join('');

    this.querySelectorAll('.edit-region-btn').forEach(button => {
        button.addEventListener('click', this.handleEditClick.bind(this));
    });
    this.querySelectorAll('.delete-region-btn').forEach(button => {
        button.addEventListener('click', this.handleDeleteClick.bind(this));
    });
  }

  handleEditClick(event) {
    const regionId = event.target.dataset.id;
    const regionToEdit = this.regions.find(region => String(region.id) === String(regionId));
    if (regionToEdit) {
      this.dispatchEvent(new CustomEvent('edit-region', {
        bubbles: true,
        composed: true,
        detail: regionToEdit
      }));
    } else {
      console.warn('Region not found for editing:', regionId);
    }
  }

  async handleDeleteClick(event) {
    const regionId = event.target.dataset.id;
    if (confirm(`Are you sure you want to delete region with ID: ${regionId}?`)) {
      try {
        await deleteRegions(regionId);
        this.regions = this.regions.filter(region => String(region.id) !== String(regionId));
        this.renderRegions();
      } catch (error) {
        console.error('Error deleting region:', error);
        alert('Failed to delete region. Please try again later.');
      }
    }
  }
}

customElements.define('lst-regions', lstregions);