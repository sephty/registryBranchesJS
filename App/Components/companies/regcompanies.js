import { postCompanies, patchCompanies } from '../../../Apis/company/companyApi.js';
import companyModel from '../../../Models/companyModel.js';

export class RegCompanies extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.attachFormEvents();
  }

  render() {
    this.innerHTML = /* html */ `
        <div class="card mt-3">
            <div class="card-header">Registro de Compañías <span class="badge bg-secondary" id="id-view"></span></div>
            <div class="card-body">
                <form id="company-form">
                    <div class="row">
                        <div class="col-md-6">
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="col-md-6">
                            <label for="UKNiu" class="form-label">UKNiu</label>
                            <input type="text" class="form-control" id="UKNiu" name="UKNiu">
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-4">
                            <label for="address" class="form-label">Dirección</label>
                            <input type="text" class="form-control" id="address" name="address">
                        </div>
                        <div class="col-md-4">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email">
                        </div>
                         <div class="col-md-4">
                            <label for="CityId" class="form-label">Ciudad ID</label>
                            <input type="number" class="form-control" id="CityId" name="CityId" required>
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
      const form = this.querySelector('#company-form');
      form.addEventListener("reset", () => this.clearForm());
      form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.saveData();
      });
  }

  async saveData() {
      const form = this.querySelector('#company-form');
      const data = Object.fromEntries(new FormData(form).entries());
      const id = this.querySelector('#id-view').textContent;

      try {
        const response = id
            ? await patchCompanies(data, id)
            : await postCompanies({ ...companyModel, ...data });

        if (response && response.ok) {
            this.dispatchEvent(new CustomEvent('company-saved', { bubbles: true, composed: true }));
            this.clearForm();
        } else {
            const errorText = await response.text();
            console.error('Error al guardar la compañía:', errorText);
            alert('No se pudo guardar la compañía.');
        }
      } catch (error) {
          console.error('Error de red:', error);
          alert('Error de conexión al guardar.');
      }
  }

  loadDataForEdit(company) {
      const form = this.querySelector('#company-form');
      const { id, ...dataToLoad } = company;
      
      for (const key in dataToLoad) {
          if (form.elements[key]) {
              form.elements[key].value = dataToLoad[key];
          }
      }
      this.querySelector('#id-view').textContent = id;
  }
  
  clearForm() {
      this.querySelector('#company-form').reset();
      this.querySelector('#id-view').textContent = '';
  }
}
customElements.define("reg-companies", RegCompanies);