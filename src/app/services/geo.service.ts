import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { map, timeout, flatMap } from 'rxjs/operators';
import insidepolygon from 'point-in-polygon';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { GeoCollectionReference, GeoFirestore, GeoQuery } from 'geofirestore';
import { firestore } from 'firebase';
import { GeoAddress } from '../models/geoAddress';
import { TraderProfile } from '../models/traderProfile';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  dbRef: any;
  geoFire: GeoFirestore;
  locations: GeoCollectionReference;
  geoPostalcodes: GeoCollectionReference;
  hits = new BehaviorSubject([]);
  urlEncoder = new HttpUrlEncodingCodec();

  constructor(private db: AngularFirestore, private http: HttpClient) {
    this.geoFire = new GeoFirestore(db.firestore);
    this.locations = this.geoFire.collection('locations');
    this.geoPostalcodes = this.geoFire.collection('GeoData');
  }

  createLocation(traderId: string, coords: Array<number>) {
    return this.locations
      .doc(traderId)
      .set({
        coordinates: new firestore.GeoPoint(coords[0], coords[1]),
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async createLocationByAddress(
    traderId: string,
    trader: Partial<TraderProfile>
  ) {
    const searchAddress = trader.postcode;
    const addresses = await this.findCoordinatesByFullAddressWithFallback(
      trader.postcode,
      trader.city,
      trader.street,
      trader.number + ''
    );

    if (addresses) {
      return this.createLocation(traderId, addresses.coordinates);
    }
  }

  getLocations(radius: number, coords: Array<number>) {
    const query: GeoQuery = this.locations.near({
      center: new firestore.GeoPoint(coords[0], coords[1]),
      radius,
    });

    return query.get();
  }

  getUserPosition(): Promise<Array<number | undefined>> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          resolve(undefined);
        }
      );
    });
  }

  findCoordinatesByPostalOrCity(
    searchString: string
  ): Observable<GeoAddress[]> {
    if (!searchString) {
      return null;
    }

    const isSearchPostal = !isNaN(Number(searchString.substring(0, 1)));
    const search = searchString.toLowerCase();
    const arr = isSearchPostal ? 'd.postal_arr' : 'd.city_arr';

    return from(
      this.db
        .collection('GeoData')
        .ref.orderBy('d.postalcode')
        .where(arr, 'array-contains', search)
        .get()
    ).pipe(
      map((a) =>
        a.docs.map((d) => {
          const data = d.data();
          return {
            city: data.d.city,
            postalcode: data.d.postalcode,
            coordinates: [
              data.d.coordinates.latitude,
              data.d.coordinates.longitude,
            ],
          } as GeoAddress;
        })
      )
    );
  }

  async getPostalAndCityByLocation(
    location: Array<number>
  ): Promise<GeoAddress | undefined> {
    if (!location || !location[0] || !location[1]) {
      return undefined;
    }

    // location = [52.2839641, 8.034344599999999];

    const items = await this.geoPostalcodes
      .near({
        center: new firestore.GeoPoint(location[0], location[1]),
        radius: 20,
      })
      .limit(8)
      .get();

    const locationInverted = location.reverse();

    if (items.size > 0) {
      for (const i of items.docs) {
        const data = i.data();
        const postalShape = JSON.parse(data.shape);

        const inside = insidepolygon(
          locationInverted,
          postalShape.coordinates[0]
        );

        if (inside) {
          // console.log(data.postalcode + ' ' + data.city + ' is in: ' + inside);
          // console.log('coordinates: ' + data.coordinates);
          // console.log(data.coordinates);

          return {
            city: data.city,
            postalcode: data.postalcode,
            coordinates: [
              data.coordinates.latitude,
              data.coordinates.longitude,
            ],
            radius: 0,
          };
        }
      }

      // fallback to the nearest center of a plz
      const theNext = items.docs
        .sort((a, b) => a.distance - b.distance)[0]
        .data();

      return {
        city: theNext.city,
        postalcode: theNext.postalcode,
        coordinates: location,
        radius: 0,
      };
    }

    return null;
  }

  async findCoordinatesByFullAddressWithFallback(
    postal: string,
    city: string,
    street: string,
    streetnumber: string
  ): Promise<GeoAddress> {
    const streetcontent = (street ? street + ' ' + streetnumber : '').trim();
    const postalcitycontent = (postal + ' ' + city).trim();
    let searchFor = (postalcitycontent + ' ' + streetcontent).trim();
    let result = await this.findCoordinatesByFullAddress(searchFor);

    // fallback to postal and city only
    if (!result && streetcontent) {
      searchFor = postalcitycontent;
      result = await this.findCoordinatesByFullAddress(searchFor);
    }

    return result;
  }

  // nominatim service, be careful, 1 request per second is the limit
  async findCoordinatesByFullAddress(address: string): Promise<GeoAddress> {
    if (!address) {
      return null;
    }

    const response: any = await this.http
      .get(
        'https://nominatim.openstreetmap.org/?addressdetails=1&format=json&limit=1&q=' +
          encodeURIComponent(address.trim())
      )
      .toPromise();

    if (response && response.length > 0) {
      const res = response[0];
      return {
        city: res.address.town ? res.address.town : res.address.city,
        postalcode: res.address.postcode,
        coordinates: [Number(res.lat), Number(res.lon)],
        radius: 0,
      };
    }

    return null;
  }
}
