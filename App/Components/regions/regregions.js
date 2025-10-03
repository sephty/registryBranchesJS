import { postRegions, patchRegions } from '../../../Apis/region/regionApi.js';
import regionModel from '../../../Models/regionModel.js';

export class RegRegions extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.attachFormEvents();
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">Registro de Regiones <span class="badge bg-secondary" id="id-view"></span></div>
            <div class="card-body">
                <form id="region-form">
                    <div class="row">
                        <div class="col-md-6">
                            <label for="name" class="form-label">Nombre de la Región</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="col-md-6">
                            <label for="CountryId" class="form-label">País ID</label>
                            <input type="number" class="form-control" id="CountryId" name="CountryId" required>
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
      const form = this.querySelector('#region-form');
      form.addEventListener("reset", () => this.clearForm());
      form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.saveData();
      });
  }

  async saveData() {
      const form = this.querySelector('#region-form');
      const data = Object.fromEntries(new FormData(form).entries());
      const id = this.querySelector('#id-view').textContent;
      try {
          const response = id 
              ? await patchRegions(data, id) 
              : await postRegions({ ...regionModel, ...data });
          if (response && response.ok) {
              this.dispatchEvent(new CustomEvent('region-saved', { bubbles: true, composed: true }));
              this.clearForm();
          } else {
              alert('No se pudo guardar la región.');
          }
      } catch (error) {
          alert('Error de conexión al guardar.');
      }
  }

  loadDataForEdit(region) {
      const form = this.querySelector('#region-form');
      form.elements["name"].value = region.name;
      form.elements["CountryId"].value = region.CountryId;
      this.querySelector('#id-view').textContent = region.id;
  }
  
  clearForm() {
      this.querySelector('#region-form').reset();
      this.querySelector('#id-view').textContent = '';
  }
}
customElements.define("reg-regions", RegRegions);