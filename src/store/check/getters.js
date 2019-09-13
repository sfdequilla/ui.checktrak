export default {
  check(state) {
    return state.check
  },
  checks(state) {
    return state.checks
  },
  cancelling(state) {
    return state.cancelling
  },
  claiming(state) {
    return state.claiming
  },
  clearing(state) {
    return state.clearing
  },
  creating(state) {
    return state.creating
  },
  deleting(state) {
    return state.deleting
  },
  editing(state) {
    return state.editing
  },
  loading(state) {
    return state.loading
  },
  transmitting(state) {
    return state.transmitting
  },
  newCheck(state) {
    return state.newCheck
  },
  selectedChecks(state) {
    return state.selectedChecks
  },
  showCancel(state) {
    return state.showCancel
  },
  showCheck(state) {
    return state.showCheck
  },
  showClaim(state) {
    return state.showClaim
  },
  showClear(state) {
    return state.showClear
  },
  showCreate(state) {
    return state.showCreate
  },
  showDelete(state) {
    return state.showDelete
  },
  showEdit(state) {
    return state.showEdit
  },
  showTransmit(state) {
    return state.showTransmit
  },
  waiting(state) {
    return state.waiting
  }
}
