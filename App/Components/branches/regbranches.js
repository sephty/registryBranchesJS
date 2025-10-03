import { getbranches, deletebranches, postbranches, patchbranches } from '../../../Apis/branch/branchApi.js';
import branchesModel from '../../../Models/branchesModel.js';

export class lstbranches extends HTMLElement {
  constructor() {
    super();
    this.branches = [];
    this.render();
    this.fetchbranches();
  }

  async fetchbranches() {
    try {
      const branches = await getbranches();
      this.branches = Array.isArray(branches) ? branches : [];
      this.renderbranches();
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
      @import "./App/Components/branches/brancheStyle.css";
      </style>
      <div class="card mt-3">
        <div class="card-header">
          Listado de branches
          <div class="float-end">
            <!-- REMOVED: Add New Branch Button -->
            <button class="btn btn-success btn-sm ms-2" id="syncDataBtn">Refresh Data</button>
          </div>
        </div>
        <div class="card-body">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Numero Comercial</th>
                <th>Direccion</th>
                <th>Email</th>
                <th>Nombre Contacto</th>
                <th>Telefono</th>
                <th>Ciudad ID</th>
                <th>Compañia ID</th>
                <th>Acciones</th> 
              </tr>
            </thead>
            <tbody id="branch-list"></tbody>
          </table>
        </div>
      </div>
    `;
    this.querySelector('#syncDataBtn').addEventListener('click', this.fetchbranches.bind(this)); 
  }

  renderbranches() {
    const tbody = this.querySelector('#branch-list');
    if (!tbody) return;
    tbody.innerHTML = this.branches.map(branch => `
      <tr data-id="${branch.id || ''}">
        <td>${branch.numberCommercial || ''}</td>
        <td>${branch.address || ''}</td>
        <td>${branch.email || ''}</td>
        <td>${branch.contact_name || ''}</td>
        <td>${branch.phone || ''}</td>
        <td>${branch.cityID || ''}</td>
        <td>${branch.companyID || ''}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-branch-btn" data-id="${branch.id || ''}">Edit</button>
          <button class="btn btn-danger btn-sm delete-branch-btn" data-id="${branch.id || ''}">Delete</button>
        </td>
      </tr>
    `).join('');

    this.querySelectorAll('.edit-branch-btn').forEach(button => {
        button.addEventListener('click', this.handleEditClick.bind(this));
    });
    this.querySelectorAll('.delete-branch-btn').forEach(button => {
        button.addEventListener('click', this.handleDeleteClick.bind(this));
    });
  }


  async syncData() {
    console.log('Refreshing data...');
    await this.fetchbranches();
  }
  


  handleEditClick(event) {
    const branchId = event.target.dataset.id;
    const branchToEdit = this.branches.find(branch => String(branch.id) === String(branchId));
    if (branchToEdit) {
      this.dispatchEvent(new CustomEvent('editBranch', {
        bubbles: true,
        composed: true,
        detail: branchToEdit
      }));
    } else {
      console.warn('Branch not found for editing:', branchId);
    }
  }

  async handleDeleteClick(event) { 
    const branchId = event.target.dataset.id;
    if (confirm(`Are you sure you want to delete branch with ID: ${branchId}?`)) {
        
        try {
            const response = await deletebranches(branchId);
            if (response.ok) {
                this.branches = this.branches.filter(b => String(b.id) !== String(branchId));
                this.renderbranches();
                console.log('Deleted branch from API:', branchId);
                this.dispatchEvent(new CustomEvent('branchDeleted', { bubbles: true, composed: true, detail: { id: branchId } }));
            } else {
                console.error('Failed to delete branch:', branchId, await response.text());
                alert('Failed to delete branch on server.');
            }
        } catch (error) {
            console.error('Error deleting branch:', error);
            alert('Error deleting branch.');
        }

    }
  }

}

customElements.define('lst-branches', lstbranches);