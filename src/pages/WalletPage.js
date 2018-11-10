import React, { Component, Fragment } from 'react'
import Resource from '../components/Wallet/Resource'
import MyTokens from '../components/Wallet/MyTokens'
import { FormattedMessage } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col } from 'react-bootstrap'
import { TopView } from '../components/Common/Common'
import _ from 'lodash'

class Wallet extends Component {
  render() {
    const { accountStore, eosioStore, marketStore } = this.props

    return (
      <Fragment>
        {accountStore.isLogin ? (
          <section>
            <TopView className="container-overlap bg-blue-700">
              <div className="container container-md">
                <Grid style={{ minWidth: '1440px' }}>
                  <Row>
                    <Col xs={5} className="col-xs-offset-1">
                      <h1>
                        <strong>
                          <i>{accountStore.loginAccountInfo.account_name}</i>
                        </strong>
                      </h1>
                      <h4>{`${accountStore.liquid} EOS`}</h4>
                    </Col>
                  </Row>
                </Grid>
              </div>
            </TopView>

            <div className="container container-lg">
              <Grid fluid style={{ padding: '24px 0px', margin: '-24px 0px' }}>
                <Row>
                  <Col md={7} lg={8}>
                    <MyTokens
                      accountStore={accountStore}
                      marketStore={marketStore}
                      eosioStore={eosioStore}
                    />
                  </Col>
                  <Col md={5} lg={4}>
                    <div className="card">
                      <h5 className="card-heading">
                        <FormattedMessage id="Account Resource" />
                      </h5>
                      <div className="card-body pb0">
                        <Resource accountStore={accountStore} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </div>
          </section>
        ) : (
          ''
        )}
      </Fragment>
    )
  }
}

export default compose(
  inject('marketStore', 'eosioStore', 'tradeStore', 'accountStore'),
  observer
)(Wallet)
