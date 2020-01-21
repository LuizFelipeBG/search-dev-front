import React from 'react'
import * as L from 'leaflet'
import { getAreaByZoom } from '../../utils';

const style = {
  height: '600px'
}

export default class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map('map', {
      center: this.props.center,
      zoom: 14.4,
      zoomDelta: 0.4,
      layers: [
        L.tileLayer(
          'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            // maxZoom: 18,
            id: 'mapbox.streets',
            accessToken:
              'pk.eyJ1IjoiZHJlYWRub3VnaHQiLCJhIjoiY2pxcG40aG50MDNheTQzcG1oNTJ5dGZ1YyJ9.N2SDd0Xj-EOXSXm-NHhDGw'
          }
        )
      ]
    }).on('zoomend', function (e) {
      const zoom = this.getZoom()
      const bounds = getAreaByZoom(zoom)

      this.eachLayer(layerToResize => {
        if (layerToResize.options.ioId) {
          const { lat, lng } = layerToResize.getBounds().getCenter()
          layerToResize.setBounds(L.latLng(lat, lng).toBounds(bounds))
        }
      })
    });

  }

  render() {
    return (
      <div>
        <div id="map" style={style} />
      </div>
    )
  }

}
