export class NavMenu extends HTMLElement{
    constructor(){
        super();
        this.render();
    }
    render(){
        this.innerHTML = /* html */ `
        <style rel="stylesheet">
          @import "./App/Components/navMenu/menuStyle.css";
        </style>
          <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
              <a class="navbar-brand" href="#">Navbar</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#" data-verocultar='["c"]'>Contactos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["ct"]'>Branches</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["cmp"]'>Companies (WIP)</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["cy"]'>Cities (WIP)</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["r"]'>Regions (WIP)</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" data-verocultar='["co"]'>Countries (WIP)</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>        
        `;
        this.querySelectorAll(".nav-link").forEach((val, id) => {
          val.addEventListener("click", (e)=>{
              let data = JSON.parse(e.target.dataset.verocultar);
              let mainContent = document.querySelector('#mainContent');
              mainContent.innerHTML= "";
              switch (data[0]){
                case 'c':
                  mainContent.innerHTML="<contacto-component></contacto-component>";
                  break;
                case 'ct':
                  mainContent.innerHTML="<branches-component></branches-component>"
                  break;
                case 'cmp':
                  mainContent.innerHTML="<lst-companies></lst-companies>";
                  break;
                case 'cy':
                  mainContent.innerHTML="<p>city-component</p>";
                  break;
                case 'r':
                  mainContent.innerHTML="<p>region-component</p>";
                  break;
                case 'co':
                  mainContent.innerHTML="<p>country-component</p>";
                  break;
                }
              e.stopImmediatePropagation();
              e.preventDefault();
          })
      });
    }
}
customElements.define("nav-menu",NavMenu);