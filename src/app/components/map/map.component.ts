import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  Loader
} from "@googlemaps/js-api-loader";
import {
  google_maps_api_key
} from 'src/environments/environment';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Output() clicked_map = new EventEmitter < {
    click_data: JSON
  } > ();
  map!: google.maps.Map
  map_element_id: string = 'google-map'

  constructor() {}

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: google_maps_api_key
    })

    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById(this.map_element_id) !, {
        center: {
          lat: 31.668944911571028,
          lng: 34.867502999920276
        },
        zoom: 7
      })

      let geocoder = new google.maps.Geocoder()

      google.maps.event.addListener(this.map, 'click',  (event: {
        latLng: any;
      }) => {
        geocoder.geocode({
          location: event.latLng
        },  (results) => {
          const city = results![0].address_components.filter(address => address.types.includes('locality'))
          const full_name = results![0].formatted_address
          const coordinates = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }

          const click_data = {
            city: city,
            full_name: full_name,
            coordinates: coordinates
          }

          this.sendBackClickData(click_data)
        })
      })
    })
  }

  sendBackClickData(click_data: any) {
    this.clicked_map.emit({click_data: click_data})
  }
}
