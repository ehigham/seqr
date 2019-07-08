import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { USER_NAME_FIELDS } from 'shared/utils/constants'

import { setPassword } from '../reducers'
import { getNewUser } from '../selectors'
import UserFormLayout from './UserFormLayout'


const minLengthValidate = value => ((value && value.length > 7) ? undefined : 'Password must be at least 8 characters')
const maxLengthValidate = value => ((value && value.length < 128) ? undefined : 'Password must be no longer than 128 characters')

const samePasswordValidate = (value, allValues) => (value === allValues.password ? undefined : 'Passwords do not match')

const FIELDS = [
  {
    name: 'password',
    label: 'Password',
    validate: [minLengthValidate, maxLengthValidate],
    type: 'password',
    width: 16,
    inline: true,
  },
  {
    name: 'passwordConfirm',
    label: 'Confirm Password',
    validate: samePasswordValidate,
    type: 'password',
    width: 16,
    inline: true,
  },
  ...USER_NAME_FIELDS,
]

const SetPassword = ({ onSubmit, newUser }) =>
  <UserFormLayout
    header="Welcome to seqr"
    subheader="Fill out this form to finish setting up your account"
    onSubmit={onSubmit}
    form="set-password"
    fields={FIELDS}
    initialValues={newUser}
  />

SetPassword.propTypes = {
  newUser: PropTypes.object,
  onSubmit: PropTypes.func,
}

const mapStateToProps = state => ({
  newUser: getNewUser(state),
})

const mapDispatchToProps = {
  onSubmit: setPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword)
