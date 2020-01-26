import React from 'react';
import * as L from 'leaflet'

import Map from "../components/map/Map";
import { getAreaByZoom } from '../utils';
import './MapPage.css';

const intialCenter = [-20.279078, -40.294805]
// const intialCenter = [-20.1293824, -40.3193856]
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

    const filterAndShowDevs = (filtersSeparatedByVig) => {
        const missingCoords = !props.lat || !props.lng
        if (missingCoords) return

        const handleDevs = async () => {
            const techs = filtersSeparatedByVig.split(',').map(item => item.trim())
            const paramstoFilter = {
                techs,
                long: props.lng,
                lat: props.lat
            }
            mapRef.current.map.eachLayer(layer => {
                if (layer.options.ioId) {
                    layer.remove()
                }
            })
            try {
                const devsFetched = await props.devs.get(paramstoFilter)

                devsFetched.map(normalizeImageByDevData(addImageOverLay))
            } catch (err) {
                props.devs.data.map(normalizeImageByDevData(addImageOverLay))
            }
        }
        handleDevs()

    }

    React.useEffect(() => {
        const missingCoords = !props.lat || !props.lng
        
        if (!missingCoords) {
            setCenter([props.lat, props.lng])
        }
    }, [props.lat, props.lng])

    const coordInputs = () => {
        const coordsPredefineds = props.lat && props.lng
        if (!coordsPredefineds) return (
            <div className='above-map-block coords-wrapper'>
                <input ref={latRef} placeholder='Digite LATITUDE' onKeyDown={(e) => props.handleManualCoords(e, latRef, lngRef)} />
                <input ref={lngRef} placeholder='Digite LONGITUDE' onKeyDown={(e) => props.handleManualCoords(e, latRef, lngRef)} />
            </div>)

    }

    return (
        <div>
            {coordInputs()}
            <Map ref={mapRef} center={center} />
            <div className='above-map-block search-wrapper'>
                <input placeholder='FILTRAR...' onKeyDown={async (e) => {
                    if (e.keyCode === 13) {
                        e.currentTarget.blur()
                        // await filterAndShowDevs('react')
                        await filterAndShowDevs(e.currentTarget.value)
                    }
                }} />
            </div>
        </div>
    )

}