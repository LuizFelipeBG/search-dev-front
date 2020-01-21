import api from "./client";

export const registerAndInsertNewDev = async (event, { lng, lat }, setAllUsers) => {
    const arrayTechs = event.currentTarget.techs.value.split(',')
    const mapArray = arrayTechs.map(item => item.trim())
    const obj = {
        long: lng,
        lat,
        techs: mapArray,
        github_username: event.currentTarget.user.value
    }

    const devRegistered = await api.post('/devs', obj)
    setAllUsers(currentDevs => [devRegistered.data, ...currentDevs])
}