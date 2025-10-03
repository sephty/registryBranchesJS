

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
            <button class="btn btn-primary btn-sm" id="addNewBranchBtn">Add New Branch</button>
            <button class="btn btn-success btn-sm ms-2" id="syncDataBtn">Sync Data</button>
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
    this.querySelector('#addNewBranchBtn').addEventListener('click', this.addNewLocalBranch.bind(this));
    this.querySelector('#syncDataBtn').addEventListener('click', this.syncData.bind(this));
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

  addNewLocalBranch() {
    const tempId = `temp-${Date.now()}`;
    const newBranch = { ...branchesModel, id: tempId, numberCommercial: 'New Branch' };
    this.branches.push(newBranch);
    this.renderbranches();
    console.log('Added new local branch:', newBranch);
  }

  async syncData() {
    console.log('Syncing data...');
    const branchesToSync = [...this.branches]; 

    for (const branch of branchesToSync) {
        if (branch.id && branch.id.startsWith('temp-')) {

            const { id, ...dataToPost } = branch; 
            try {
                const response = await postbranches(dataToPost);
                if (response.ok) {
                    const newApiBranch = await response.json();
                    console.log('Posted new branch:', newApiBranch);

                    const index = this.branches.findIndex(b => b.id === branch.id);
                    if (index !== -1) {
                        this.branches[index] = newApiBranch;
                    }
                } else {
                    console.error('Failed to post new branch:', branch, await response.text());
                }
            } catch (error) {
                console.error('Error posting new branch:', error);
            }
        } else if (branch.isDeleted) {

            try {
                const response = await deletebranches(branch.id);
                if (response.ok) {
                    console.log('Deleted branch from API:', branch.id);
                    this.branches = this.branches.filter(b => b.id !== branch.id);
                } else {
                    console.error('Failed to delete branch:', branch.id, await response.text());
                }
            } catch (error) {
                console.error('Error deleting branch:', error);
            }
        } else {

            try {
                const response = await patchbranches(branch, branch.id);
                if (response.ok) {
                    const updatedBranch = await response.json();
                    console.log('Patched existing branch:', updatedBranch);

                    const index = this.branches.findIndex(b => b.id === updatedBranch.id);
                    if (index !== -1) {
                        this.branches[index] = updatedBranch;
                    }
                } else {
                    console.warn('Could not patch branch (maybe no changes or error):', branch.id, await response.text());
                }
            } catch (error) {
                console.error('Error patching branch:', error);
            }
        }
    }
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

  handleDeleteClick(event) {
    const branchId = event.target.dataset.id;
    if (confirm(`Are you sure you want to delete branch with ID: ${branchId}?`)) {
        const branchIndex = this.branches.findIndex(branch => String(branch.id) === String(branchId));
        if (branchIndex !== -1) {
            const branchToDelete = this.branches[branchIndex];
            if (branchToDelete.id && branchToDelete.id.startsWith('temp-')) {
                this.branches.splice(branchIndex, 1);
                this.renderbranches();
                console.log('Removed local new branch:', branchId);
            } else {

                branchToDelete.isDeleted = true;
                this.branches = this.branches.filter(b => b.id !== branchToDelete.id); 
                this.renderbranches();
                console.log('Branch marked for deletion:', branchId);
            }
        }
    }
  }

  updateBranchInList(updatedBranch) {
      const index = this.branches.findIndex(b => String(b.id) === String(updatedBranch.id));
      if (index !== -1) {
          this.branches[index] = updatedBranch; 
      } else {
          this.branches.push(updatedBranch); 
      }
      this.renderbranches();
  }

  removeBranchFromList(branchId) {
      this.branches = this.branches.filter(b => String(b.id) !== String(branchId));
      this.renderbranches();
  }
}

customElements.define('lst-branches', lstbranches);