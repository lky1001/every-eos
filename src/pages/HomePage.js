import React, { Component } from 'react'
import { Grid, Row, Col, Button, Dropdown, MenuItem, Modal } from 'react-bootstrap'
import styled from 'styled-components'

import MarketView from '../components/Market/MatketView'
import Faq from '../components/Home/Faq'

const TitleView = styled.span`
  color: white;
  font-size: 40px;
`
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
        <TopView className="bg-blue-500">
          <Row>
            <Col xs={3} />
            <Col xs={6}>
              <TitleView>Everyeos</TitleView>
            </Col>
            <Col xs={3} />
          </Row>
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
