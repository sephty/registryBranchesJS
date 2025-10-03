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
      this.switchToView(e.target.dataset.view);
  }
  
  switchToView(viewId, refreshList = false) {
      this.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      this.querySelectorAll('div[id]').forEach(div => div.style.display = 'none');
      document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
      document.querySelector(`#${viewId}`).style.display = 'block';

      if (refreshList) {
          this.querySelector('lst-regions').fetchRegions();
      }
  }
  
  switchToListView(refresh = false) {
      this.switchToView('lstregions', refresh);
  }

  handleEditRegion(event) {
    this.switchToView('regregions');
    this.querySelector('reg-regions').loadDataForEdit(event.detail);
  }
}
customElements.define("region-component", RegionComponent);