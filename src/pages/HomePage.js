import React, { Component } from 'react'
import { Grid, Row, Col, Button, Dropdown, MenuItem, Modal } from 'react-bootstrap'
import styled from 'styled-components'

import MarketView from '../components/Market/MatketView'
import Faq from '../components/Home/Faq'

const TopView = styled.div`
  height: 500px;
`

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModalMsg: false,
      showModalNew: false
    }
  }

  closeMsg() {
    this.setState({ showModalMsg: false })
  }

  openMsg() {
    this.setState({ showModalMsg: true })
  }

  closeNew() {
    this.setState({ showModalNew: false })
  }

  openNew() {
    this.setState({ showModalNew: true })
  }

  render() {
    return (
      <section>
        <TopView className="container-overlap bg-indigo-500">
          <div class="container container-md">
            <h2>EVERYEOS</h2>
            <h3>Decentralized exchange based on eos.io</h3>
          </div>
        </TopView>
        <div className="container container-lg">
          <MarketView />
        </div>
        <div className="container container-lg">
          <Faq />
        </div>
      </section>
    )
  }
}

export default Home
