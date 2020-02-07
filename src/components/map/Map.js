import React from 'react'
import * as L from 'leaflet'
import { getAreaByZoom } from '../../utils';

const style = {
  height: '99.5vh'
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

  componentDidUpdate(prev) {
    // when center (state coords changes)
    if (prev.center[0] === this.props.center[0] && prev.center[1] === this.props.center[1]) return
    const newCenter = [this.props.center[0], this.props.center[1]]
    
    this.map.flyTo(new L.latLng(newCenter[0], newCenter[1]), 13.5, {duration: 1.9})
  }

  render() {
    return (
      <div>
        <div id="map" style={style} />
      </div>
    )
  }

}
