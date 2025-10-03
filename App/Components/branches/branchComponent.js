// App/Components/branches/branchesComponent.js (Updated)

import './regbranches.js';
import './lstbranches.js';

export class branchesComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.addEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/branches/branchesStyle.css";
      </style>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active mnubranches" aria-current="page" href="#" data-verocultar='["#regbranches",["#lstbranches"]]' id="regBranchLink">Registrar branches</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnubranches" href="#" data-verocultar='["#lstbranches",["#regbranches"]]' id="lstBranchLink">Listado de branchess</a>
        </li>
      </ul>
      <div class="container" id="regbranches" style="display:block;">
          <reg-branches></reg-branches>
      </div>
      <div class="container" id="lstbranches" style="display:none;">
          <lst-branches></lst-branches>
      </div>
    `;
    this.querySelectorAll(".mnubranches").forEach((val, id) => {
        val.addEventListener("click", (e)=>{
            let data = JSON.parse(e.target.dataset.verocultar);
            let cardVer = document.querySelector(data[0]);
            cardVer.style.display = 'block';
            data[1].forEach(card => {
                let cardActual = document.querySelector(card);
                cardActual.style.display = 'none';
            });
            this.querySelectorAll(".mnubranches").forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
            e.stopImmediatePropagation();
            e.preventDefault();
        })
    });
  }

  addEventListeners() {
    this.addEventListener('editBranch', this.handleEditBranch.bind(this));
    this.addEventListener('branchAdded', this.handleBranchUpdatedFromReg.bind(this));
    this.addEventListener('branchUpdated', this.handleBranchUpdatedFromReg.bind(this));
    this.addEventListener('branchDeleted', this.handleBranchDeletedFromReg.bind(this));
  }

  handleEditBranch(event) {
    const branchToEdit = event.detail;
    document.querySelector('#regbranches').style.display = 'block';
    document.querySelector('#lstbranches').style.display = 'none';

    this.querySelector('#lstBranchLink').classList.remove('active');
    this.querySelector('#regBranchLink').classList.add('active');

    const regBranchesElement = this.querySelector('reg-branches');
    if (regBranchesElement && typeof regBranchesElement.loadDataForEdit === 'function') {
      regBranchesElement.loadDataForEdit(branchToEdit);
    } else {
      console.error('reg-branches component not found or loadDataForEdit method missing.');
    }
  }

  handleBranchUpdatedFromReg(event) {
      const lstBranchesElement = this.querySelector('lst-branches');
      if (lstBranchesElement && typeof lstBranchesElement.fetchbranches === 'function') {
          lstBranchesElement.fetchbranches();
      }
      this.querySelector('#lstbranches').style.display = 'block';
      this.querySelector('#regbranches').style.display = 'none';
      this.querySelector('#regBranchLink').classList.remove('active');
      this.querySelector('#lstBranchLink').classList.add('active');
  }

  handleBranchDeletedFromReg(event) {
      const lstBranchesElement = this.querySelector('lst-branches');
      if (lstBranchesElement && typeof lstBranchesElement.fetchbranches === 'function') {
          lstBranchesElement.fetchbranches();
      }
      this.querySelector('#lstbranches').style.display = 'block';
      this.querySelector('#regbranches').style.display = 'none';
      this.querySelector('#regBranchLink').classList.remove('active');
      this.querySelector('#lstBranchLink').classList.add('active');
  }
}

customElements.define("branches-component", branchesComponent);