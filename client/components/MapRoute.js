/* eslint-disable complexity */
import React from 'react'
import { connect } from 'react-redux'
import { postOrder, getMyLocation, updateOrderToDropOff } from '../store'
import UserMap from './UserMap'
import { Button, Grid } from 'semantic-ui-react'

class Map extends React.Component {
  state = {
    origin: '',
    destination: '',
    centerLat: 41.8781,
    centerLng: -87.6298,
    zoom: 14
  }

  componentDidMount() {
    const options = {
      timeout: 30000
    }
    this.watch = navigator.geolocation.watchPosition(
      this.props.getMyLocation,
      err => console.log(err),
      options
    )
  }

  componentDidUpdate() {
    if (!this.props.order.status && this.props.myLocation.lat) {
      this.markers = [[this.props.myLocation.lng, this.props.myLocation.lat]]
      if (
        this.state.centerLat !== this.props.myLocation.lat ||
        this.state.centerLng !== this.props.myLocation.lng
      ) {
        this.setState({
          centerLat: this.props.myLocation.lat,
          centerLng: this.props.myLocation.lng
        })
      }
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watch)
  }

  handleBook = () => {
    // These constants will take my lat/lng from my location for pickup location, I have hard coded them in the meantime.
    let newOrder = {
      pickupLocationLat: this.props.myLocation.lat,
      pickupLocationLng: this.props.myLocation.lng,
      dropoffLocationLat: this.props.user.defaultDeliveryLat,
      dropoffLocationLng: this.props.user.defaultDeliveryLng,
      deliveryNotes: ''
    }
    this.props
      .postOrder(newOrder)
      .then(data =>
        this.handleRoute(
          [data.startLocationLng, data.startLocationLat],
          [data.pickupLocationLng, data.pickupLocationLat]
        )
      )
  }

  handleRoute = (origin, destination) => {
    this.setState({
      origin,
      destination,
      centerLat: (Number(origin[1]) + Number(destination[1])) / 2,
      centerLng: (Number(origin[0]) + Number(destination[0])) / 2,
      zoom: 12.8
    })

    this.markers = [origin, destination] //adding arrays of [lat,lng] will draw markers on the map
  }

  changeToDropOff = () => {
    this.props.updateOrderToDropOff(this.props.order.id)
    const {
      pickupLocationLng,
      pickupLocationLat,
      deliveryLocationLng,
      deliveryLocationLat
    } = this.props.order

    const newOrigin = [pickupLocationLng, pickupLocationLat]
    const newDest = [deliveryLocationLng, deliveryLocationLat]
    this.handleRoute(newOrigin, newDest)
  }

  render() {
    const orderExists = this.props.order.status
    const ToPickup = this.props.order.status === 'ToPickup'

    return (
      <React.Fragment>
        <Grid textAlign="center" style={{ height: '85vh' }}>
          <Grid.Row
            style={{
              height: '80%'
            }}
          >
            <UserMap
              {...this.state}
              markers={this.markers}
              style={{ width: '100%' }}
            />
          </Grid.Row>
          <Grid.Row
            style={{
              height: '20%'
            }}
          >
            {/* We will need to add conditionals here for different control bar, or handle it similarly to UserMap */}
            {this.props.user &&
              !this.props.user.defaultDeliveryLat &&
              !this.props.user.defaultDeliveryLng && (
                <>
                  <h4>
                    To book a Rover, complete your profile by adding a default
                    dropoff address!
                  </h4>
                  <Button
                    type="button"
                    as="a"
                    href="/me/default-dropoff"
                    size="large"
                    style={{
                      width: '90%',
                      margin: '1vw'
                    }}
                  >
                    Add Address {`&`} Get Rovin'
                  </Button>
                </>
              )}
            {!orderExists &&
              this.props.user.defaultDeliveryLat !== null &&
              this.props.user.defaultDeliveryLng !== null && (
                <Button
                  type="button"
                  onClick={this.handleBook}
                  size="large"
                  style={{
                    width: '90%',
                    margin: '1vw'
                  }}
                >
                  Book Me A Rover!
                </Button>
              )}
            {orderExists && <p>Driver Is En Route</p>}
            {ToPickup && (
              <Button
                type="button"
                onClick={this.changeToDropOff}
                size="large"
                style={{
                  width: '90%',
                  margin: '1vw'
                }}
              >
                Leftovers Have Been Picked Up!
              </Button>
            )}
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapDispatch = {
  postOrder,
  getMyLocation,
  updateOrderToDropOff
}

const mapState = state => {
  return {
    order: state.order,
    myLocation: state.myLocation,
    user: state.user,
    driver: state.user.driver
  }
}

export default connect(mapState, mapDispatch)(Map)
