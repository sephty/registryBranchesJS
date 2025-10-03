import '../../../Models/branchesModel.js';
import './regbranches.js';
import './lstbranches.js';

export class BranchesComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active mnubranches" aria-current="page" href="#" data-view="regbranches">Registrar Sucursal</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnubranches" href="#" data-view="lstbranches">Listado de Sucursales</a>
        </li>
      </ul>
      <div id="regbranches" style="display:block;"><reg-branches></reg-branches></div>
      <div id="lstbranches" style="display:none;"><lst-branches></lst-branches></div>
    `;
  }

  setupEventListeners() {
    this.querySelectorAll(".mnubranches").forEach(link => {
        link.addEventListener("click", (e) => this.handleTabClick(e));
    });
    this.addEventListener('branch-saved', () => this.switchToListView(true));
    this.addEventListener('edit-branch', (e) => this.handleEditBranch(e));
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
          const listComponent = this.querySelector('lst-branches');
          if (listComponent && typeof listComponent.fetchbranches === 'function') {
              listComponent.fetchbranches();
          }
      }
  }
  
  switchToListView(refresh = false) {
      this.switchToView('lstbranches', refresh);
  }

  handleEditBranch(event) {
    const branchToEdit = event.detail;
    this.switchToView('regbranches');
    const regComponent = this.querySelector('reg-branches');
    regComponent.loadDataForEdit(branchToEdit);
  }
}

customElements.define("branches-component", BranchesComponent);
