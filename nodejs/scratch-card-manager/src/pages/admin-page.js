import React from 'react'
import {toast} from 'react-toastify'
import debounce from 'lodash.debounce'
import PrimaryButton from '../buttons/primary-button'

import PrizeItem from '../prize-item'
import Flex from '../flex'

class AdminPage extends React.Component {
  constructor() {
    super()
    this.state = {
      inventory: {},
      successRate: 100,
      intervalId: null
    }
    this.updateStatus = this.updateStatus.bind(this)
    this.resetAssigned = this.resetAssigned.bind(this)
    this.redeemPrize = this.redeemPrize.bind(this)
  }

  async updateStatus() {
    const response = await fetch('/status')
    const {inventory, successRate} = await response.json()
    this.setState({inventory, successRate})
  }

  resetAssigned = debounce(async () => {
    const response = await fetch('/prizes/reset', {
      method: 'post'
    })
    const {inventory, resetCount} = await response.json()
    toast(`Reset ${resetCount} prizes from assigned to available!`)
    this.setState({inventory})
  }, 400)

  redeemPrize = debounce(async (id) => {
    const response = await fetch(`/prizes/${id}/redeem`, {
      method: 'post'
    })
    const {inventory, error} = await response.json()
    if (error) {
      toast(error)
    } else {
      this.setState({inventory})
      toast(`One ${inventory[id].name} has been redeemed!`)
    }
  }, 400)

  componentDidMount() {
    this.updateStatus()
    const intervalId = setInterval(this.updateStatus, 5000)
    this.setState({intervalId})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    // @todo: allow user to see and edit success rate
    const {inventory, successRate} = this.state
    return (
      <div className="App">
        <header className="App-header">
          {inventory && (
            <React.Fragment>
              <Flex alignItems="center" margin="sm">
                {Object.values(inventory).map((item) => (
                  <PrizeItem {...item} redeemPrize={this.redeemPrize} />
                ))}
              </Flex>
              <PrimaryButton onClick={this.resetAssigned}>
                Reset Assigned Prizes
              </PrimaryButton>
            </React.Fragment>
          )}
        </header>
      </div>
    )
  }
}

export default AdminPage
