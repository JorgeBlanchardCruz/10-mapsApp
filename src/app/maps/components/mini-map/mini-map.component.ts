import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent {

  @Input() lngLat?: [number, number];
  @ViewChild('map') public divMap?: ElementRef;
  public map?: Map;

  ngAfterViewInit() {

    if (!this.divMap?.nativeElement)
      throw new Error('divMap is required');

    if (!this.lngLat)
      throw new Error('lngLat is required');

    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: new LngLat(this.lngLat[0], this.lngLat[1]),
      zoom: 10,
    });

  }
}
