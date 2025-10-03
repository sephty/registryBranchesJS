import { postCities, patchCities } from '../../../Apis/city/cityApi.js';
import cityModel from '../../../Models/cityModel.js';

export class RegCities extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.attachFormEvents();
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">Registro de Ciudades <span class="badge bg-secondary" id="id-view"></span></div>
            <div class="card-body">
                <form id="city-form">
                    <div class="row">
                        <div class="col-md-6">
                            <label for="name" class="form-label">Nombre de la Ciudad</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="col-md-6">
                            <label for="RegionId" class="form-label">Región ID</label>
                            <input type="number" class="form-control" id="RegionId" name="RegionId" required>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col text-center">
                            <button type="submit" class="btn btn-primary">Guardar</button>
                            <button type="reset" class="btn btn-secondary">Limpiar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      `;
  }
  
  attachFormEvents() {
      const form = this.querySelector('#city-form');
      form.addEventListener("reset", () => this.clearForm());
      form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.saveData();
      });
  }

  async saveData() {
      const form = this.querySelector('#city-form');
      const data = Object.fromEntries(new FormData(form).entries());
      const id = this.querySelector('#id-view').textContent;
      try {
        const response = id ? await patchCities(data, id) : await postCities({ ...cityModel, ...data });
        if (response && response.ok) {
            this.dispatchEvent(new CustomEvent('city-saved', { bubbles: true, composed: true }));
            this.clearForm();
        } else {
             alert('No se pudo guardar la ciudad.');
        }
      } catch (error) {
          alert('Error de conexión al guardar.');
      }
  }

  loadDataForEdit(city) {
      const form = this.querySelector('#city-form');
      form.elements["name"].value = city.name;
      form.elements["RegionId"].value = city.RegionId;
      this.querySelector('#id-view').textContent = city.id;
  }
  
  clearForm() {
      this.querySelector('#city-form').reset();
      this.querySelector('#id-view').textContent = '';
  }
}
customElements.define("reg-cities", RegCities);