import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ORDER = 'GET_ORDER'
const SET_ORDER = 'SET_ORDER'

/**
 * INITIAL STATE
 */
const order = {}

/**
 * ACTION CREATORS
 */
const getOrder = order => ({ type: GET_ORDER, order })
const setOrder = order => ({ type: SET_ORDER, order })

/**
 * THUNK CREATORS
 */
export const updateOrderToDropOff = id => async dispatch => {
  try {
    const { data } = await axios.put('/api/orders', {
      id,
      status: 'ToDropOff',
      pickupTime: Date.now()
    })
    dispatch(getOrder(data))
  } catch (error) {
    console.error(error)
  }
}

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
    return res.data
  } catch (err) {
    console.error(err)
  }
}

export const fetchUserCurrentOrder = () => {
  return async (dispatch, getState) => {
    const state = getState()
    let userId = state.user.id
    const currentOrder = await axios.get(`/api/orders/${userId}`)
    dispatch(setOrder(currentOrder.data))
  }
}

/**
 * REDUCER
 */
export default function(state = order, action) {
  switch (action.type) {
    case GET_ORDER:
      return action.order
    case SET_ORDER:
      return action.order
    default:
      return state
  }
}
