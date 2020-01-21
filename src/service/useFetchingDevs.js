import { useState, useEffect, useMemo } from 'react';
import api from './client';

const useFetchingDevs = () => {
    const [allUsers, setAllUsers] = useState([])
    const [devsFiltered, setDevsFiltered] = useState([])

    const getDevs = async () => {
        const users = await api.get('/devs')
        setAllUsers(users.data.reverse())
        return users
    }

    const filterDevs = useMemo(() => async (paramsToFilter) => {
        try {
            const devs = await api.get('/devs', paramsToFilter)
            setDevsFiltered(devs.data)
            return devs.data
        }catch(err) {
            console.log('Error in useFetchingDevs.js ', err)
        }
    }, [setDevsFiltered, devsFiltered])

    useEffect(() => { getDevs() }, [])

    const devs = useMemo(() => ({ data: devsFiltered, get: filterDevs }),
        [filterDevs, devsFiltered])

    return { allUsers, setAllUsers, devs }
}

export default useFetchingDevs;