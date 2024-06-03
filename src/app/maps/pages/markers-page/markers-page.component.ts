import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  marker: Marker;
  color: string;
}

interface PlainMarker {
  lngLat: number[];
  color: string;
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {

  @ViewChild('map')
  public divMap?: ElementRef;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-4.622693679921895, 56.60590866782928);
  public zoomLevel: number = 10;

  public markers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    this.readFromLocalStorage();

    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Jorge Blanchard';

    // const marker = new Marker({
    //     element: markerHtml,
    //     color: 'red',
    //     draggable: true
    //   })
    //   .setLngLat(this.currentLngLat)
    //   .addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  public createMarker() {
    if ( !this.map )
      return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat, color);
  }

  public addMarker(lngLat: LngLat, color: string = 'blue') {
    if ( !this.map )
      return;

    const marker = new Marker({
        color: color,
        draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map!);

    this.markers.push( {marker, color} );

    this.saveToLocalStorage();
  }

  public removeMarker(index: number) {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);

    this.saveToLocalStorage();
  }

  public flyTo( marker: Marker ) {

    this.map?.flyTo( {
      zoom: 14,
      center: marker.getLngLat()
    } );

  }

  public saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ marker, color }) => {
      return {
        lngLat: marker.getLngLat().toArray(),
        color: color
      };
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  public readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '';
    if ( !plainMarkersString )
      return;

    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach( ({ lngLat, color }) => {
      const coords = new LngLat(lngLat[0], lngLat[1]);
      this.addMarker(coords, color);
    });
  }

}
