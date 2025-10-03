import { postbranches, patchbranches, deletebranches } from '../../../Apis/branch/branchApi.js';
import { branchesModel } from '../../../Models/branchesModel.js';

export class RegBranches extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.saveData();
    this.enabledBtns();
    this.eventoEditar();
    this.eventoEliminar();
    this.disableFrm(true);
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/branches/brancheStyle.css";
      </style>
      <div class="card mt-3">
        <div class="card-header">
          Registro de Sucursales <span class="badge rounded-pill text-bg-primary" id="idView"></span>
        </div>
        <div class="card-body">
          <form id="frmDataBranch">
            <div class="row">
              <div class="col">
                <label for="numberCommercial" class="form-label">Numero Comercial</label>
                <input type="text" class="form-control" id="numberCommercial" name="numberCommercial">
              </div>
              <div class="col">
                <label for="address" class="form-label">Direccion</label>
                <input type="text" class="form-control" id="address" name="address">
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" name="email">
              </div>
              <div class="col">
                <label for="contact_name" class="form-label">Nombre Contacto</label>
                <input type="text" class="form-control" id="contact_name" name="contact_name">
              </div>
              <div class="col">
                <label for="phone" class="form-label">Telefono</label>
                <input type="text" class="form-control" id="phone" name="phone">
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="cityID" class="form-label">Ciudad ID</label>
                <input type="text" class="form-control" id="cityID" name="cityID">
              </div>
              <div class="col">
                <label for="companyID" class="form-label">Compañia ID</label>
                <input type="text" class="form-control" id="companyID" name="companyID">
              </div>
            </div>
            <div class="row mt-3">
              <div class="col">
                <div class="container mt-4 text-center">
                  <a href="#" class="btn btn-primary" id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEditar","#btnEliminar"]]'>Nuevo</a>
                  <a href="#" class="btn btn-dark" id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Cancelar</a>
                  <a href="#" class="btn btn-success" id="btnGuardar" data-ed='[["#btnEditar","#btnCancelar","#btnNuevo","#btnEliminar"],["#btnGuardar"]]'>Guardar</a>
                  <a href="#" class="btn btn-warning" id="btnEditar" data-ed='[[],[]]'>Editar</a>
                  <a href="#" class="btn btn-danger" id="btnEliminar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Eliminar</a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
    this.querySelector("#btnNuevo").addEventListener("click", (e) => {
      this.ctrlBtn(e.target.dataset.ed);
      this.resetIdView();
      this.disableFrm(false);
    });
    this.querySelector("#btnCancelar").addEventListener("click", (e) => {
      this.ctrlBtn(e.target.dataset.ed);
      this.resetIdView();
      this.disableFrm(true);
    });
  }

  resetIdView = () => {
    const idView = this.querySelector('#idView');
    idView.innerHTML = '';
  }

  eventoEditar = () => {
    this.querySelector('#btnEditar').addEventListener("click", (e) => {
      this.editData();
      e.stopImmediatePropagation();
      e.preventDefault();
    });
  }

  eventoEliminar = () => {
    this.querySelector('#btnEliminar').addEventListener("click", (e) => {
      this.delData(e);
      e.stopImmediatePropagation();
      e.preventDefault();
    });
  }

  ctrlBtn = (e) => {
    let data = JSON.parse(e);
    data[0].forEach(boton => {
      let btnActual = this.querySelector(boton);
      btnActual.classList.remove('disabled');
    });
    data[1].forEach(boton => {
      let btnActual = this.querySelector(boton);
      btnActual.classList.add('disabled');
    });
  }

  enabledBtns = () => {
    this.querySelectorAll(".btn").forEach((val) => {
      this.ctrlBtn(val.dataset.ed);
    });
  }

  editData = () => {
    const frmRegistro = this.querySelector('#frmDataBranch');
    const datos = Object.fromEntries(new FormData(frmRegistro).entries());
    const idView = this.querySelector('#idView');
    let id = idView.textContent;
    patchbranches(id, datos)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
        }
      })
      .then(responseData => {
        // Optionally handle response
      })
      .catch(error => {
        console.error('Error en la solicitud PATCH:', error.message);
      });
  }

  delData = (e) => {
    const idView = this.querySelector('#idView');
    let id = idView.textContent;
    deletebranches(id)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error en la solicitud DELETE: ${response.status} - ${response.statusText}`);
        }
      })
      .then(responseData => {
        this.resetIdView();
        this.disableFrm(true);
        this.ctrlBtn(e.target.dataset.ed);
      })
      .catch(error => {
        console.error('Error en la solicitud DELETE:', error.message);
      });
  }

  saveData = () => {
    const frmRegistro = this.querySelector('#frmDataBranch');
    this.querySelector('#btnGuardar').addEventListener("click", (e) => {
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());
      postbranches(datos)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
          }
        })
        .then(responseData => {
          this.viewData(responseData.id);
        })
        .catch(error => {
          console.error('Error en la solicitud POST:', error.message);
        });
      this.ctrlBtn(e.target.dataset.ed);
      e.stopImmediatePropagation();
      e.preventDefault();
    });
  }

  viewData = (id) => {
    const idView = this.querySelector('#idView');
    idView.innerHTML = id;
  }

  disableFrm = (estado) => {
    const frmRegistro = this.querySelector('#frmDataBranch');
    Object.entries(branchesModel).forEach(([key, value]) => {
      if (frmRegistro.elements[key]) {
        frmRegistro.elements[key].value = value;
        frmRegistro.elements[key].disabled = estado;
      }
    });
  }
}

customElements.define("reg-branches", RegBranches);