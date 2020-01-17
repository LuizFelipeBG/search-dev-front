export const request = async (createMutation, objMutation) => {
  const query = createMutation(objMutation)
  const userIdentification = localStorage.getItem('_user')

  const response = await fetch('https://middleware.stg.gerdau.xdevel.com.br/', {
    method: 'POST',
    headers: {
      token: JSON.parse(userIdentification).token,
      name: JSON.parse(userIdentification).name,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query
    })
  })

  const { data, errors } = await response.json()

  return { data, errors, response }
}
