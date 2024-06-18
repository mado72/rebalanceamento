import { Component, inject } from '@angular/core';
import { Portifolio, PortifolioService } from '../services/portifolio.service';

@Component({
  selector: 'app-portifolio',
  templateUrl: './portifolio.component.html',
  styleUrls: ['./portifolio.component.scss']
})
export class PortifolioComponent {

  private _portifolioService = inject(PortifolioService);

  portifolio?: Portifolio;

  portifolioSubscriber = this._portifolioService.portifolio.subscribe(portifolio=>{
    this.portifolio = portifolio || undefined;
  });


  ngOnDestroy(): void {
      this.portifolioSubscriber.unsubscribe()
  }

}
