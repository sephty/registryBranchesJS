import './regcities.js';
import './lstcities.js';

export class CityComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active mnucity" href="#" data-view="regcities">Registrar Ciudad</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnucity" href="#" data-view="lstcities">Listado de Ciudades</a>
        </li>
      </ul>
      <div id="regcities" style="display:block;"><reg-cities></reg-cities></div>
      <div id="lstcities" style="display:none;"><lst-cities></lst-cities></div>
    `;
  }

  setupEventListeners() {
    this.querySelectorAll(".mnucity").forEach(link => {
        link.addEventListener("click", (e) => this.handleTabClick(e));
    });
    this.addEventListener('city-saved', () => this.switchToListView(true));
    this.addEventListener('edit-city', (e) => this.handleEditCity(e));
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
          this.querySelector('lst-cities').fetchCities();
      }
  }
  
  switchToListView(refresh = false) {
      this.switchToView('lstcities', refresh);
  }

  handleEditCity(event) {
    this.switchToView('regcities');
    this.querySelector('reg-cities').loadDataForEdit(event.detail);
  }
}
customElements.define("city-component", CityComponent);