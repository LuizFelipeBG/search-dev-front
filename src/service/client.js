import axios from 'axios'

const api = axios.create({
    baseURL: "https://search-devs.herokuapp.com"
})

export default api