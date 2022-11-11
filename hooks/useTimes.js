import axios from 'axios'
import { useQuery } from 'react-query'

const fetchTimes = async (userID ) => {
  const res = await axios(`/api/userTimes?userID=${userID}`)
//   const result = parsed.filter(x => x.id <= limit)
  return res.data
}

const useTimes = userID => {
  return useQuery(['times', userID], async () => await fetchTimes(userID))
}

export { useTimes, fetchTimes }
