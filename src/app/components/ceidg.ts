import { Component } from '@angular/core';

@Component({
  selector: 'app-ceidg',
  template: `
  <div class="container">
    <div class="detail">Claudix Paweł Wicher</div>
    <div class="detail">Numer NIP: 6121799181</div>
    <div class="detail">Numer REGON: 363264887</div>
    <div class="detail">ul. 1 Maja 1 / 30</div>
    <div class="detail">59-300 Lubin</div>
    <a class="pdf-link" href="CEIDG.pdf" target="_blank">CEIGD</a>
  </div>
  `,
  styles: `
  :host {
    font-size: 2rem;
  }

  .detail {
    margin: 1rem 0;
  }

  .pdf-link {
    margin-top: 2rem;
    display: block;
  }`,
})
export class Ceidg { }
