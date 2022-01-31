import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async blogObj => {
  const config = {
    headers: { Authorization: token },
  }

  const respsonse = await axios.post(baseUrl, blogObj, config)
  return respsonse.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const update = async (id, blogObj) => {
  const response = await axios.put(`${baseUrl}/${id}`, blogObj)
  return response.data
}

export default { getAll, create, setToken, update, remove }
