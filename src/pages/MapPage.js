import React from 'react';
import * as L from 'leaflet'

import Map from "../components/map/Map";
import { getAreaByZoom } from '../utils';
// import api from '../service/client';

const intialCenter = [-20.279078, -40.294805]
const normalizeImageByDevData = (addLayerInMapFunc) => dev => {
    const imageOverlayProps = {
        id: dev._id,
        imagePath: dev.avatar_url,
        lat: dev.location.coordinates[1],
        long: dev.location.coordinates[0],
    }
    return addLayerInMapFunc(imageOverlayProps)
}

export default function MapPAge(props) {

    const [center, setCenter] = React.useState(intialCenter)
    const latRef = React.useRef(null)
    const lngRef = React.useRef(null)
    const mapRef = React.useRef(null)


    const addImageOverLay = (imageOverlayProps) => {
        const { id: ioId,
            imagePath, 
            lat = -20.306705, long = -40.351330 } = imageOverlayProps
        
        const bounds = getAreaByZoom(mapRef.current.map.getZoom())

        const imageBound = L.latLng(lat, long).toBounds(bounds)
        let _imageOverLay = L.imageOverlay(imagePath, imageBound, { ioId, opacity: 0.74, interactive: true })
        _imageOverLay.on('click', function (e) { console.log('I have been clicked ', e, this) })
        _imageOverLay.addTo(mapRef.current.map)
    }

    React.useEffect(() => {
        const missingCoords = !props.lat || !props.lng
        if (missingCoords) return 
        
        const handleDevs = async () => {
            setCenter([props.lat, props.lng])
            try {
                const devsFetched = await props.devs.get({
                    techs: ['react'],
                    long: props.lng,
                    lat: props.lat
                })
                
                devsFetched.map(normalizeImageByDevData(addImageOverLay))
            } catch (err) {
                props.devs.data.map(normalizeImageByDevData(addImageOverLay))
            }
        }
        handleDevs()

    }, [props.lat, props.lng])


    const coordInputs = () => {
        const coordsPredefineds = props.lat && props.lng
        if (!coordsPredefineds) return (
            <React.Fragment>
                <input ref={latRef} placeholder='Digite LATITUDE' />
                <input ref={lngRef} placeholder='Digite LONGITUDE' />
            </React.Fragment>)

    }

    return (
        <div>
            {coordInputs()}
            <Map ref={mapRef} center={center} />
        </div>
    )

}