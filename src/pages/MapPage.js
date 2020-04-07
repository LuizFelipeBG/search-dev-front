import React, {useState} from 'react';
import * as L from 'leaflet'
import Modal from 'react-responsive-modal'

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
    const { allUsers } = props
    const [center, setCenter] = useState(intialCenter)
    const [openModal, setOpenModal] = useState(false)
    const latRef = React.useRef(null)
    const lngRef = React.useRef(null)
    const mapRef = React.useRef(null)
    const [userModal, setUserModal] = useState({})

    const getUserInfo = (id) => {
        setOpenModal(true)
        const userAllInfo = allUsers.filter(item => item._id === id)
        setUserModal(...userAllInfo)
    }

    const addImageOverLay = (imageOverlayProps) => {
        const { id: ioId,
            imagePath,
            lat = -20.306705, long = -40.351330,  } = imageOverlayProps

        const bounds = getAreaByZoom(mapRef.current.map.getZoom())

        const imageBound = L.latLng(lat, long).toBounds(bounds)
        let _imageOverLay = L.imageOverlay(imagePath, imageBound, { ioId, opacity: 0.9, interactive: true })
        _imageOverLay.on('click',(e) => getUserInfo(ioId) ,this)
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
            <Modal open={openModal} onClose={() => setOpenModal(false)} center className="modal">
                {openModal ? 
                <div className="main-container">
                    <img src={userModal.avatar_url} alt={userModal.name} />
                    <div className="user-info">
                    <strong>{userModal.name}: </strong>
                    <a href={userModal.user_profile} target="_blank">Perfil do GitHub </a>
                    </div>
                    <div className="bio-info">
                        <strong>Bio: </strong><p>{userModal.bio}</p>
                    </div> 
                </div>
                : 
                null}
            </Modal>
            <div className='above-map-block search-wrapper'>
                <input className="input-filter" placeholder='FILTRAR...' onKeyDown={async (e) => {
                    if (e.keyCode === 13) {
                        e.currentTarget.blur()
                        // await filterAndShowDevs('react')
                        await filterAndShowDevs(e.currentTarget.value.toLowerCase())
                    }
                }} />
            </div>
        </div>
    )

}