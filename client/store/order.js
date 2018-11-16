import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ORDER = 'GET_ORDER'

/**
 * INITIAL STATE
 */
const order = {}

/**
 * ACTION CREATORS
 */
const getOrder = order => ({ type: GET_ORDER, order })

/**
 * THUNK CREATORS
 */
export const postOrder = ({
  pickupLocationLat,
  pickupLocationLng,
  dropoffLocationLat,
  dropoffLocationLng,
  deliveryNotes
}) => async dispatch => {
  try {
    const res = await axios.post('/api/orders', {
      pickupLocationLat,
      pickupLocationLng,
      dropoffLocationLat,
      dropoffLocationLng,
      deliveryNotes
    })
    dispatch(getOrder(res.data))
    // return [myLocationLng, myLocationLat]
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = order, action) {
  switch (action.type) {
    case GET_ORDER:
      return action.order
    default:
      return state
  }
}