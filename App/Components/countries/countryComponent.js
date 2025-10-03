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
          <a class="nav-link active mnucountry" href="#" data-view="regcountries">Registrar País</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnucountry" href="#" data-view="lstcountries">Listado de Países</a>
        </li>
      </ul>
      <div id="regcountries" style="display:block;"><reg-countries></reg-countries></div>
      <div id="lstcountries" style="display:none;"><lst-countries></lst-countries></div>
    `;
  }

  setupEventListeners() {
    this.querySelectorAll(".mnucountry").forEach(link => {
        link.addEventListener("click", (e) => this.handleTabClick(e));
    });

    this.addEventListener('country-saved', () => this.switchToListView(true));
    this.addEventListener('edit-country', (e) => this.handleEditCountry(e));
  }

  handleTabClick(e) {
      e.preventDefault();
      const viewId = e.target.dataset.view;
      this.switchToView(viewId);
  }
  
  switchToView(viewId, refreshList = false) {
      this.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      this.querySelectorAll('div[id]').forEach(div => div.style.display = 'none');

      document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
      document.querySelector(`#${viewId}`).style.display = 'block';

      if (refreshList) {
          const listComponent = this.querySelector('lst-countries');
          if (listComponent) {
            listComponent.fetchCountries();
          }
      }
  }
  
  switchToListView(refresh = false) {
      this.switchToView('lstcountries', refresh);
  }

  handleEditCountry(event) {
    const companyToEdit = event.detail;
    this.switchToView('regcountries');
    const regComponent = this.querySelector('reg-countries');
    regComponent.loadDataForEdit(companyToEdit);
  }
}

customElements.define("country-component", CountryComponent);