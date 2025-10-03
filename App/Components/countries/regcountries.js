import { postCountries, patchCountries } from '../../../Apis/country/countryApi.js';
import countryModel from '../../../Models/countryModel.js';

export class RegCountries extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.attachFormEvents();
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">Registro de Países <span class="badge bg-secondary" id="id-view"></span></div>
            <div class="card-body">
                <form id="country-form" class="w-50 mx-auto">
                    <div class="mb-3">
                        <label for="name" class="form-label">Nombre del País</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary">Guardar</button>
                        <button type="reset" class="btn btn-secondary">Limpiar</button>
                    </div>
                </form>
            </div>
        </div>
      `;
  }
  
  attachFormEvents() {
      const form = this.querySelector('#country-form');
      form.addEventListener("reset", () => this.clearForm());
      form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.saveData();
      });
  }

  async saveData() {
      const form = this.querySelector('#country-form');
      const data = Object.fromEntries(new FormData(form).entries());
      const id = this.querySelector('#id-view').textContent;

      try {
          const response = id
              ? await patchCountries(data, id)
              : await postCountries({ ...countryModel, ...data });

          if (response && response.ok) {
              this.dispatchEvent(new CustomEvent('country-saved', { bubbles: true, composed: true }));
              this.clearForm();
          } else {
              alert('No se pudo guardar el país.');
          }
      } catch (error) {
          console.error('Error de red:', error);
          alert('Error de conexión al guardar.');
      }
  }

  loadDataForEdit(country) {
      const form = this.querySelector('#country-form');
      form.elements["name"].value = country.name;
      this.querySelector('#id-view').textContent = country.id;
  }
  
  clearForm() {
      this.querySelector('#country-form').reset();
      this.querySelector('#id-view').textContent = '';
  }
}
customElements.define("reg-countries", RegCountries);