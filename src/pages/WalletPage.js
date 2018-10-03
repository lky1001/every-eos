import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Button, Dropdown, MenuItem } from 'react-bootstrap'

class Wallet extends Component {
  componentDidMount = async () => {
    const { accountStore } = this.props

    this.disposer = accountStore.subscribeLoginState(changed => {
      if (changed.oldValue !== changed.newValue) {
        this.forceUpdate()
      }
    })
  }

  componentWillUnmount = () => {
    if (this.disposer) {
      this.disposer()
    }
  }

  handleTokenSymbolChange = async () => {}

  render() {
    const { accountStore } = this.props

    return (
      <Fragment>
        {accountStore.isLogin ? (
          <section>
            <div className="container-overlap bg-blue-500">
              <div className="media m0 pv">
                <div className="media-left" />
                <div className="media-body media-middle">
                  <h4 className="media-heading">{accountStore.loginAccountInfo.account_name}</h4>
                  <h4 className="media-heading">{`${accountStore.liquid} EOS`}</h4>
                </div>
              </div>
            </div>
            <Grid fluid>
              <Row>
                {/* Left column */}
                <Col md={7} lg={8}>
                  <form name="user.profileForm" className="card">
                    <h5 className="card-heading pb0">
                      <FormattedMessage id="Token Balance" />
                    </h5>
                    <div className="card-body">
                      <Row>
                        <Col xs={6}>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter Symbol"
                            onChange={s => this.handleTokenSymbolChange(s)}
                          />
                        </Col>
                        <Col xs={6} className="text-right">
                          <label class="checkbox checkbox-inline">
                            <input type="checkbox" value="" />
                            Hide no balance
                          </label>
                        </Col>
                      </Row>
                    </div>
                    <div className="card-divider" />
                    <div className="card-body">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>
                              <FormattedMessage id="Token" />
                            </th>
                            <th>
                              <FormattedMessage id="Available" />
                            </th>
                            <th>
                              <FormattedMessage id="Frozen" />
                            </th>
                            <th>
                              <FormattedMessage id="EOS valuation" />
                            </th>
                            <th>
                              <FormattedMessage id="Exchange" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>KARMA</td>
                            <td>0.0000</td>
                            <td>0.0000</td>
                            <td>1.000 EOS</td>
                            <td>
                              <FormattedMessage id="Move" />
                            </td>
                          </tr>
                          <tr>
                            <td>BLACK</td>
                            <td>0.0000</td>
                            <td>0.0000</td>
                            <td>1.000 EOS</td>
                            <td>
                              <FormattedMessage id="Move" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </form>
                </Col>
                {/* Right column */}
                <Col md={5} lg={4}>
                  <div className="card">
                    <h5 className="card-heading">
                      <FormattedMessage id="Account Resource" />
                    </h5>
                    <div className="card-body pb0">Cpu, Net, Ram</div>
                  </div>
                </Col>
              </Row>
            </Grid>
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
