import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent {

  @ViewChild('map')
  public divMap?: ElementRef;

  private MaxZoomLevel: number = 18;

  public map?: Map;
  public zoomLevel: number = 10;

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    this.mapListeners();
  }

  private mapListeners(): void {
    if ( !this.map )
       throw 'El mapa no fue inicializado';

    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map!.getZoom() as number;
    });

    this.map.on('zoomend', (ev) => {
      if ( this.map!.getZoom() < this.MaxZoomLevel )
        return;

      this.map!.zoomTo(this.MaxZoomLevel);
    });
  }

  public zoomIn(): void {
    this.map?.zoomIn();
  }

  public zoomOut(): void {
    this.map?.zoomOut();
  }

  public zoomRangeChange( value: string ): void {
    this.map?.setZoom( Number(value) );
  }
}
