import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Map, MapStyle, config, Marker } from '@maptiler/sdk';
import { HttpClient } from '@angular/common/http';
import { ApiEmtService } from '../../../services/api-emt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.scss'],
  standalone: true,
  imports: [
    //NgxMapLibreGLModule
  ]
})
export class HomeRoutedComponent implements OnInit {

  map: Map | undefined;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    private oHttpClient: HttpClient,
    private oApiEmtService: ApiEmtService,
    private oRouter: Router
  ) { }

  ngOnInit() {
    initFlowbite();
    config.apiKey = 'vpZgX7WduInzFAWcrZ3w';
  }
  ngAfterViewInit() {
    //     const initialState = { lng: -0.3774, lat: 39.4696, zoom: 10 };
   const initialState = { lng: -0.36838386187782796,lat:39.448005399032276  , zoom: 16 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      

    });



    // Obtener todas las paradas de autobús y agregar marcadores para cada una
    this.oApiEmtService.getAllParadas().subscribe(paradas => {
      paradas.forEach(parada => {
        const marker = new Marker({ color: "#FF0000" }).setLngLat([parada.geo_point_2d.lon, parada.geo_point_2d.lat])
          .addTo(this.map!);

        marker.getElement().addEventListener('click', () => {
          this.oRouter.navigate(['/user/parada/view/', parada.id_parada]);
        });
        // Aplicar estilo de cursor de puntero al marcador
        marker.getElement().style.cursor = 'pointer';
      });
    });
  }
  ngOnDestroy() {
    this.map?.remove();
  }
}
