import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="contact-container">
      <div class="contact-name">Claudix Paweł Wicher</div>
      <div class="contact-address">ul. 1 Maja 1 / 30</div>
      <div class="contact-city">59-300 Lubin</div>
      <div class="contact-nip">NIP: 6121799181</div>
      <div class="contact-regon">REGON: 363264887</div>
      <a class="contact-pdf" href="CEIDG.pdf" target="_blank">CEIDG</a>
    </div>
  `,
  styles: `
    .contact-container {
      font-size: 1.2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      padding: 1.5rem 2rem;
      max-width: 350px;
      margin: 0 auto;
      text-align: left;
    }
    .contact-name {
      font-weight: bold;
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }
    .contact-address, .contact-city, .contact-nip, .contact-regon {
      margin-bottom: 0.3rem;
    }
    .contact-pdf {
      display: inline-block;
      color: #0d4e8e;
      text-decoration: underline;
    }
  `,
})
export class Contact { }
