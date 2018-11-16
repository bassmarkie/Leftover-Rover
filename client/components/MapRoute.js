import React from 'react'
import { connect } from 'react-redux'
import { postOrder, getMyLocation } from '../store'
import UserMap from './UserMap'
import { geolocated } from 'react-geolocated'

class Map extends React.Component {
  state = {
    origin: '',
    destination: '',
    centerLat: 41.8781,
    centerLng: -87.6298
  }
  componentDidUpdate(prevProps) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      this.props.getMyLocation,
      err => console.log(err),
      options
    )

    if (this.props.coords !== prevProps.coords) {
      this.setState({
        centerLng: this.props.coords.longitude,
        centerLat: this.props.coords.latitude
      })
    }
  }

  handleBook = () => {
    // These constants will take my lat/lng from my location for pickup location, I have hard coded them in the meantime.
    const myLat = this.state.centerLat
    const myLng = this.state.centerLng
    this.props.postOrder(myLat, myLng)
  }

  handleRoute = (origin, destination) => {
    console.log('origin', origin, 'destination', destination)
    this.setState({
      origin, //: '405 W Superior St. Chicago, IL 60654',
      destination //: '3838 N Fremon St. Chicago, IL 60613'
    })
  }
  render() {
    return (
      <React.Fragment>
        <span>
          {/* <button type="button" onClick={this.handleRoute} className="button">
            Press ME
          </button> */}
          <button type="button" onClick={this.handleBook} className="button">
            Book me a Route!
          </button>
        </span>
        <UserMap {...this.state} />
      </React.Fragment>
    )
  }
}

const mapDispatch = {
  postOrder,
  getMyLocation
}

const mapState = state => {
  return { order: state.order }
}

export default connect(mapState, mapDispatch)(
  geolocated({
    positionOptions: {
      enableHighAccuracy: false
    },
    watchPosition: true,
    userDecisionTimeout: 9000
  })(Map)
)
