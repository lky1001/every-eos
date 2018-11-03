import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import StyledProgressbar from '../StyledProgressbar'

import { Row, Col } from 'react-bootstrap'

import styled from 'styled-components'

const ResourceProgress = styled.div`
  width: 60px;
`

const TokenInfoTitle = styled.h6`
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
`

const TokenSymbolText = styled.small`
  font-size: 1.5rem;
`

class Resource extends Component {
  render() {
    const { accountStore } = this.props
    return (
      <Fragment>
        {!accountStore.isLogin ? (
          <Row className="show-grid" style={{ height: '90px' }}>
            <Col xs={12} className="text-center" style={{ margin: 'auto' }}>
              <h6 className="m0">
                <FormattedMessage id="Please Login" />
              </h6>
            </Col>
          </Row>
        ) : (
          <div>resource</div>
        )}
      </Fragment>
    )
  }
}

export default Resource
