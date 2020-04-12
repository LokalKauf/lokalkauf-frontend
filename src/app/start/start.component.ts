import {
  Component,
  OnInit,
  InjectionToken,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { debounce } from 'lodash';

import { GeoService } from '../services/geo.service';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { FormControl, Validators } from '@angular/forms';
import { SearchInputComponent } from './search-input/search-input.component';
import { GeoAddress } from '../models/geoAddress';
import { uiTexts } from 'src/app/services/uiTexts';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {
  links = [
    new Link('Bäcker', '/', true),
    new Link('Fashion ', '#fashion', false),
    new Link('Metzger', '#fleisch', false),
    new Link('Kiosk', '#bier', false),
    new Link('Weiteres', '/test', true),
  ];

  MAT_AUTOCOMPLETE_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
  DEFAULT = 'DEFAULT';

  lat: number;
  lng: number;

  coovalue: string;
  plz: string;
  coords: string;
  suggestion: any;

  currentPosition: Array<number>;
  disabledLosButton: boolean;

  isLoggedIn = false;

  preSelectedValue: any;

  locationFormControl = new FormControl(null, [Validators.required]);

  @ViewChild('searchInput', { read: ElementRef }) searchInput: any;
  constructor(
    public router: Router,
    public userService: UserService,
    private storageService: StorageService,
    private analytics: AngularFireAnalytics
  ) {
    this.disabledLosButton = true;
    this.userService.isLoggedIn$.subscribe((loggedin) => {
      this.isLoggedIn = loggedin;
    });
  }

  text = uiTexts;

  ngOnInit(): void {}

  registerTrader() {
    this.router.navigateByUrl('/trader/register/new');
  }

  navigateToLocation() {
    const val = this.locationFormControl.value;

    console.log(val);

    if (!val) {
      this.searchInput.nativeElement.getElementsByTagName('input')[0].focus();
      return;
    }

    this.router.navigate([
      '/localtraders',
      val.coordinates[0],
      val.coordinates[1],
      val.radius,
    ]);

    this.storageService.saveLocation(val);
    this.analytics.logEvent('search', {search_postalcode: val.postalcode,
                                       search_city: val.city,
                                       search_radius: val.radius});
  }
}
