import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { auth } from '../store'
import { Segment, Grid, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const { name, displayName, handleSubmit, error } = props

  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment>
          <h3
            style={{
              display: 'flex',
              justifyContent: 'center',
              justifyItems: 'center',
              flexDirection: 'column',
              padding: '4px',
              margin: '4px'
            }}
          >
            Leftover Rover
          </h3>
          <form
            onSubmit={handleSubmit}
            name={name}
            style={{
              display: 'flex',
              justifyContent: 'center',
              justifyItems: 'center',
              flexDirection: 'column',
              padding: '4px',
              margin: '4px'
            }}
          >
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" />
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
            <div />
            <Button size="small" primary type="submit">
              {displayName.toUpperCase()}
            </Button>
            {error && error.response && <div> {error.response.data} </div>}
          </form>
          <div />
          <div />
          <Button
            size="small"
            color="google plus"
            href="/auth/google"
            style={{
              display: 'flex',
              textAlign: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
              flexDirection: 'row',
              margin: 'auto',
              padding: 'auto'
            }}
          >
            <Icon
              name="google"
              style={{ float: 'left', position: 'relative' }}
            />{' '}
            GOOGLE{' '}
          </Button>
          <div />
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value.toLowerCase()
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
