import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Map, tileLayer, latLng, marker, GeoJSON, geoJSON, CircleMarker, circleMarker, LatLng, Marker, layerGroup, icon, popup } from 'leaflet';

import { Location } from '../../models/location';
import { GeoService } from '../../services/geo.service';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { from } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ThumbnailsPosition } from '@ngx-gallery/core';

@Component({
  selector: 'lk-map',
  templateUrl: './lk-map.component.html',
  styleUrls: ['./lk-map.component.scss'],
})
export class LkMapComponent implements OnInit, AfterViewInit {
  map: Map;
  radius: 0.5;
  flying: boolean;

  @Output() positionChanged = new EventEmitter<any>();
  @Output() flyEnd = new EventEmitter<any>();
  @Output() mapMove = new EventEmitter<any>();
  @Output() mapInit = new EventEmitter<any>();
  @Output() mapMarkerClick = new EventEmitter<string>();
  locations: Array<Location> = new Array<Location>();

  // esriTiles = 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{x}/{y}.pbf';
  defaultTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  hilightedMarker: Marker = undefined;

  options = {
    layers: [
      tileLayer(this.defaultTiles, {
        maxZoom: 18,
        attribution: 'Open Street Map',
      }),
    ],
    zoom: 15,
    center: latLng(52.518623, 13.376198),
  };

  heartIconBigHilight = icon({
    iconUrl: '/assets/lokalkauf-pin-blue-blue-transparent.svg',
    iconSize: [30, 30],
    iconAnchor: [16, 25],

    shadowUrl: '/assets/pin-shadow.png',
    shadowSize: [30, 22],
    shadowAnchor: [8, 18],
  });

  heartIconBig = icon({
    iconUrl: '/assets/lokalkauf-pin-blue-transparent.svg',
    iconSize: [30, 30],
    iconAnchor: [16, 25],

    shadowUrl: '/assets/pin-shadow.png',
    shadowSize: [30, 22],
    shadowAnchor: [8, 18],
  });

  markers = [
    // circleMarker(latLng(52.518623, 13.376198), {
    //   color: '#000',
    //   fillColor: '#0f0',
    //   fillOpacity: 1,
    //   opacity: 0.2,
    //   weight: 25,
    //   radius: 7,
    // }),
  ];

  route: GeoJSON<any>;

  constructor(private geo: GeoService) {}

  ngAfterViewInit(): void {}

  onMapReady(map: Map) {
    this.map = map;

    const self = this;

    this.map.on('moveend', (e: any) => {
      this.positionChanged.emit(self.map.getCenter());
    });

    this.map.on('move', (e: any) => {
      this.mapMove.emit(self.map.getCenter());
    });

    map.on('zoomend', (e: any) => {
      if (this.flying) {
        this.flying = false;
        this.flyEnd.emit(self.map.getCenter());
      }
    });

    this.mapInit.emit();
  }

  ngOnInit(): void {}

  public setCenter(position: number[], zoom: number = 18) {
    if (position) {
      this.flying = true;
      this.map.flyTo(latLng(position[0], position[1]), 18, {
        animate: true,
        duration: 2,
      });
    }
  }

  public highlightMarker(markerid: string) {
    if (markerid) {
      const m: Marker = this.findMarkerById(markerid);
      if (m) {
        if (this.hilightedMarker) {
          this.hilightedMarker.setIcon(this.heartIconBig);
        }
        m.setIcon(this.heartIconBigHilight);
        this.hilightedMarker = m;
      }
    }
  }

  public displayGeoJsonOnMap(geo: any) {
    const greenStyle = {
      color: '#009300',
      opacity: 0.65,
    };

    const newRoute = geoJSON(geo, { style: greenStyle });
    this.route = newRoute;
    newRoute.addTo(this.map);
  }

  public clearAllMarkers() {
    if (this.markers && this.markers.length > 0) {
      this.markers.forEach((m) => this.map.removeLayer(m));
    }
  }

  public clearRoute() {
    if (this.route) {
      this.map.removeLayer(this.route);
    }
  }

  public addMarker(position?: number[], emitClickEvent?: boolean) {
    const pos = position ? this.creeateLatLng(position) : this.map.getCenter();

    const id = uuid();
    if (emitClickEvent) {
      const myMarker = marker(pos, { alt: id, icon: this.heartIconBig });
      myMarker.addTo(this.map).on('click', (e) => {
        this.highlightMarker(id);
        this.mapMarkerClick.emit(id);
      });
      this.markers.push(myMarker);
    } else {
      marker(pos, { alt: id, icon: this.heartIconBig }).addTo(this.map);
    }

    return id;
  }

  public updateMarkerPosition(markerId: string, position: number[]) {
    const mrkr: Marker = this.findMarkerById(markerId);

    if (mrkr) {
      mrkr.setLatLng(this.creeateLatLng(position));
    }
  }

  private creeateLatLng(position: number[]) {
    return latLng(position[0], position[1]);
  }

  private findMarkerById(id: string) {
    let mrkr = null;
    this.map.eachLayer((layer) => {
      if (layer instanceof Marker) {
        if (layer.options.alt === id) {
          mrkr = layer;
        }
      }
    });
    return mrkr;
  }
}
