import React, { PureComponent, Fragment } from 'react'
import { Row, Col, Grid } from 'react-bootstrap'
import styled from 'styled-components'
import ColorsConstant from '../Colors/ColorsConstant'
import { getTodayNoon } from '../../utils/timezoneHelper'
import Img from 'react-image'

const TokenInfoTitle = styled.h6`
  font-size: 1.5rem;
  padding: 0;
  margin: 0;
`

const TokenSmallSymbol = styled.small`
  font-size: 1.25rem;
`
class TokenThumbnailInfo extends PureComponent {
  componentDidMount = async () => {
    const { symbol, marketStore } = this.props

    await marketStore.getTokenBySymbol(symbol, getTodayNoon().getTime())
  }

  render() {
    const { marketStore, height } = this.props
    const token = marketStore.token ? marketStore.token.data.token : null

    return (
      <Fragment>
        {token && (
          <Row style={{ height, alignItems: 'center', justifyContent: 'center' }}>
            <Col xs={4}>
              {/* 이쪽 이미지 사이즈와 중앙정렬 todo */}
              <Img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGOT9cayLNgyzsN9F6qsUkbXI7HN53PQMjdImdnlsVq9Waf3k5"
                width="64"
                height="64"
              />
            </Col>
            <Col
              xs={8}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <div>
                <TokenInfoTitle style={{ display: 'inline' }}>{token.name}</TokenInfoTitle>
                <TokenSmallSymbol> / EOS</TokenSmallSymbol>
              </div>
              <span>More info</span>
            </Col>
          </Row>
        )}
      </Fragment>
    )
  }
}

export default TokenThumbnailInfo
