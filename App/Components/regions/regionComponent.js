import './regregions.js';
import './lstregions.js';

export class RegionComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active mnuregion" href="#" data-view="regregions">Registrar Región</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuregion" href="#" data-view="lstregions">Listado de Regiones</a>
        </li>
      </ul>
      <div id="regregions" style="display:block;"><reg-regions></reg-regions></div>
      <div id="lstregions" style="display:none;"><lst-regions></lst-regions></div>
    `;
  }

  setupEventListeners() {
    this.querySelectorAll(".mnuregion").forEach(link => {
        link.addEventListener("click", (e) => this.handleTabClick(e));
    });
    this.addEventListener('region-saved', () => this.switchToListView(true));
    this.addEventListener('edit-region', (e) => this.handleEditRegion(e));
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
          const listComponent = this.querySelector('lst-regions');
          if (listComponent && typeof listComponent.fetchRegions === 'function') {
              listComponent.fetchRegions();
          }
      }
  }
  
  switchToListView(refresh = false) {
      this.switchToView('lstregions', refresh);
  }

  handleEditRegion(event) {
    const regionToEdit = event.detail;
    this.switchToView('regregions');
    const regComponent = this.querySelector('reg-regions');
    regComponent.loadDataForEdit(regionToEdit);
  }
}

customElements.define("region-component", RegionComponent);