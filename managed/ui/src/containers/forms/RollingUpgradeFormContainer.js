// Copyright (c) YugaByte, Inc.

import RollingUpgradeForm from '../../components/forms/RollingUpgradeForm';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import {SOFTWARE_PACKAGE} from '../../config';
import {rollingUpgrade, rollingUpgradeSuccess, rollingUpgradeFailure, closeDialog} from '../../actions/universe';

const mapDispatchToProps = (dispatch) => {
  return {
    submitRollingUpgradeForm: (values, universeUUID) => {
      dispatch(rollingUpgrade(values, universeUUID)).then((response) => {
        if(response.payload.status !== 200) {
          dispatch(rollingUpgradeFailure(response.payload));
        } else {
          dispatch(closeDialog());
          dispatch(rollingUpgradeSuccess(response.payload));
        }
      })
    }
  }
}

function mapStateToProps(state, ownProps) {
  var data = {
    "ybServerPackage": SOFTWARE_PACKAGE
  };
  return {
    universe: state.universe,
    initialValues: data
  };
}

var rollingUpgradeForm = reduxForm({
  form: 'RollingUpgradeForm'
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(rollingUpgradeForm(RollingUpgradeForm));