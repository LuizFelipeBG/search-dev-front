import axios from 'axios'

const baseURL = process.env.API_URI || "https://search-devs.herokuapp.com"

const api = axios.create({ baseURL })

export default api