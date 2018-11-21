import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Label } from 'semantic-ui-react'
import { updateDriver, fetchLoggedinUser } from '../store'
import { Link } from 'react-router-dom'
import { EventEmitter } from 'events'

export const driverEvent = new EventEmitter()

class DriverSwitch extends Component {
  constructor() {
    super()
    this.state = { isChecked: false }
  }

  componentDidMount() {
    if (this.props.driver) {
      this.setState({ isChecked: this.props.driver.isActive })
    }
  }

  handleChange = () => {
    !this.props.driver.isActive && driverEvent.emit('driverIsActive')
    this.props.updateDriver(this.props.driver.id, {
      isActive: !this.props.driver.isActive,
      isAvailable: true
    })
    this.setState({ isChecked: !this.state.isChecked })
  }
  render() {
    if (this.props.driver) {
      return this.props.driver.isActive ? (
        <Link to="/me">
          <Checkbox
            toggle
            onChange={this.handleChange}
            label={
              <Label size="large" color="orange">
                Stop Roving!
              </Label>
            }
            defaultChecked
          />
        </Link>
      ) : (
        <Link to="/rover">
          <Checkbox
            toggle
            onChange={this.handleChange}
            label={
              <Label size="large" color="orange">
                Start Roving!
              </Label>
            }
          />
        </Link>
      )
    } else {
      return <div />
    }
  }
}

const mapDispatch = dispatch => {
  return {
    updateDriver: (driverId, driver) => {
      dispatch(updateDriver(driverId, driver))
    },
    fetchLoggedinUser: userId => {
      dispatch(fetchLoggedinUser(userId))
    }
  }
}

const mapState = state => {
  return {
    order: state.order,
    driver: state.user.driver
  }
}

export default connect(mapState, mapDispatch)(DriverSwitch)
