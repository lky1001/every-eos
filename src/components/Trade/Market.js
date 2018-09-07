import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class Market extends Component {
  render() {
    const { marketStore } = this.props

    return (
      <Grid>
        <Row>
          <Col xs={12} md={12}>
            <Table responsive hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    <FormattedMessage id="Market" />
                  </th>
                  <th>
                    <FormattedMessage id="Last Price" />
                  </th>
                  <th>
                    <FormattedMessage id="Today Change" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {marketStore.tokens.data.tokens &&
                  marketStore.tokens.data.tokens.map(t => {
                    return (
                      <tr>
                        <th scope="row" />
                        <td>{t.market}</td>
                        <td>{t.last_price}</td>
                        <td>{t.change_24h}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Market)
