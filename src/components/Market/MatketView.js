import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col } from 'react-bootstrap'
import styled from 'styled-components'
import { ProgressBar } from 'react-bootstrap'

const Text = styled.span`
  color: ${props => props.color};
`

class MarketView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      intervalId: 0
    }
  }

  componentDidMount = async () => {
    const { marketStore } = this.props

    const id = setInterval(async () => {
      await marketStore.getTokens()
    }, 2000)

    this.setState({
      intervalId: id
    })
  }

  componentWillUnmount = async () => {
    if (this.state.intervalId > 0) {
      clearInterval(this.state.intervalId)
    }
  }

  render() {
    const { marketStore } = this.props
    const { tokenList } = marketStore

    return !tokenList ? (
      <ProgressBar striped bsStyle="success" now={40} />
    ) : (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <div className="card">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-center">
                        <FormattedMessage id="Name" />
                      </th>
                      <th className="text-center">
                        <FormattedMessage id="Last Price" />
                      </th>
                      <th className="text-center">
                        <FormattedMessage id="Today Change" />
                      </th>
                      <th className="text-center">
                        <FormattedMessage id="24h High" />
                      </th>
                      <th className="text-center">
                        <FormattedMessage id="24h Low" />
                      </th>
                      <th className="text-center">
                        <FormattedMessage id="24h Volume" />
                      </th>
                      <th className="text-center">
                        <FormattedMessage id="Trend" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenList.map(token => {
                      const todayChanged = token.last_day_price - token.last_price
                      return (
                        <tr key={token.id}>
                          <td className="va-middle text-center">{token.name}</td>
                          <td className="va-middle text-right">
                            <Text color={todayChanged > 0 ? 'Red' : 'Blue'}>{token.last_price}</Text>
                          </td>
                          <td className="va-middle text-center">
                            <Text>{todayChanged}</Text>
                          </td>
                          <td className="va-middle text-right">
                            <Text>{token.high_price_24h}</Text>
                          </td>
                          <td className="va-middle text-right">
                            <Text>{token.low_price_24h}</Text>
                          </td>
                          <td className="va-middle text-right">
                            <Text>{token.volume_24h}</Text>
                          </td>
                          <td className="va-middle text-center">
                            <em className="ion-arrow-graph-down-right text-warning" />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default compose(
  inject('marketStore'),
  observer
)(MarketView)
