import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map')
  public divMap?: ElementRef;

  private MaxZoomLevel: number = 18;

  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-4.622693679921895, 56.60590866782928);
  public zoomLevel: number = 7;

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
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

    this.map.on('move', (ev) => {
      this.currentLngLat = this.map!.getCenter();
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
