import React, { Component, Fragment } from 'react'
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
                  <span className="text-muted">Current Estimated Value.</span>
                </div>
              </div>
            </div>
            <Grid fluid>
              <Row>
                {/* Left column */}
                <Col md={7} lg={8}>
                  <form name="user.profileForm" className="card">
                    <h5 className="card-heading pb0">Balance</h5>
                    <div className="card-body">
                      <p data-type="textarea" className="is-editable text-inherit">
                        Pellentesque porta tincidunt justo, non fringilla erat iaculis in. Sed nisi
                        erat, ornare eu pellentesque quis, pellentesque non nulla. Proin rutrum, est
                        pellentesque commodo mattis, sem justo porttitor odio, id aliquet lacus
                        augue nec nisl.
                      </p>
                    </div>
                    <div className="card-divider" />
                    <div className="card-offset">
                      <div className="card-offset-item text-right">
                        <button
                          id="edit-enable"
                          type="button"
                          className="btn-raised btn btn-warning btn-circle btn-lg"
                        >
                          <em className="ion-edit" />
                        </button>
                        <button
                          id="edit-disable"
                          type="submit"
                          className="btn-raised btn btn-success btn-circle btn-lg hidden"
                        >
                          <em className="ion-checkmark-round" />
                        </button>
                      </div>
                    </div>
                    <h5 className="card-heading pb0">Contact Information</h5>
                    <div className="card-body">
                      <table className="table table-striped">
                        <tbody>
                          <tr>
                            <td>
                              <em className="ion-document-text icon-fw mr" />
                              Area
                            </td>
                            <td>Research &amp; development</td>
                          </tr>
                          <tr>
                            <td>
                              <em className="ion-egg icon-fw mr" />
                              Birthday
                            </td>
                            <td>
                              <span
                                data-type="date"
                                data-mode="popup"
                                className="is-editable text-inherit"
                              >
                                10/11/2000
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <em className="ion-ios-body icon-fw mr" />
                              Member since
                            </td>
                            <td>
                              <span
                                data-type="date"
                                data-mode="popup"
                                className="is-editable text-inherit"
                              >
                                05/11/2015
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <em className="ion-man icon-fw mr" />
                              Gender
                            </td>
                            <td>
                              <a
                                id="gender"
                                href="#"
                                data-type="select"
                                data-pk="1"
                                data-value="2"
                                data-title="Select sex"
                                className="text-inherit"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <em className="ion-android-home icon-fw mr" />
                              Address
                            </td>
                            <td>
                              <span className="is-editable text-inherit">Some street, 123</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <em className="ion-email icon-fw mr" />
                              Email
                            </td>
                            <td>
                              <span className="is-editable text-inherit">
                                <a href="#">user@mail.com</a>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <em className="ion-ios-telephone icon-fw mr" />
                              Contact phone
                            </td>
                            <td>
                              <span className="is-editable text-inherit">13-123-46578</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="card-divider" />
                    <h5 className="card-heading pb0">Recent articles</h5>
                    <div className="card-body">
                      <ul className="mda-list">
                        <li className="mda-list-item pl0 bb">
                          <div className="mda-list-item-text">
                            <h3>
                              <a href="#">Release 3.0 is out</a>
                            </h3>
                            <p>Proin metus justo, commodo in ultrices...</p>
                            <small className="text-muted">2 days ago</small>
                          </div>
                          <div className="pull-right">
                            <div className="pt-lg">
                              <em className="icon-2x ion-checkmark-circled text-success" />
                            </div>
                          </div>
                        </li>
                        <li className="mda-list-item pl0 bb">
                          <div className="mda-list-item-text">
                            <h3>
                              <a href="#">Improving compatibility</a>
                            </h3>
                            <p>Proin metus justo, commodo in ultrices...</p>
                            <small className="text-muted">3 days ago</small>
                          </div>
                          <div className="pull-right">
                            <div className="pt-lg">
                              <em className="icon-2x ion-checkmark-circled text-success" />
                            </div>
                          </div>
                        </li>
                        <li className="mda-list-item pl0">
                          <div className="mda-list-item-text">
                            <h3>
                              <a href="#">Small decisions count</a>
                            </h3>
                            <p>Proin metus justo, commodo in ultrices...</p>
                            <small className="text-muted">3 days ago</small>
                          </div>
                          <div className="pull-right">
                            <div className="pt-lg">
                              <em className="icon-2x ion-minus-circled text-warning" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </form>
                </Col>
                {/* Right column */}
                <Col md={5} lg={4}>
                  <div className="card">
                    <h5 className="card-heading">
                      {/* START dropdown */}
                      <div className="pull-right">
                        <Dropdown pullRight id="dd2">
                          <Dropdown.Toggle noCaret className="btn-flat btn-flat-icon">
                            <em className="ion-android-more-vertical" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="md-dropdown-menu">
                            <MenuItem eventKey="1">Action 1</MenuItem>
                            <MenuItem eventKey="2">Action 2</MenuItem>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      {/* END dropdown */}
                    </h5>
                    <div className="mda-list">
                      <div className="mda-list-item">
                        <img src="img/user/01.jpg" alt="List user" className="mda-list-item-img" />
                        <div className="mda-list-item-text mda-2-line">
                          <h3>
                            <a href="#">Eric Graves</a>
                          </h3>
                          <div className="text-muted text-ellipsis">Ut ac nisi id mauris</div>
                        </div>
                      </div>
                      <div className="mda-list-item">
                        <img src="img/user/02.jpg" alt="List user" className="mda-list-item-img" />
                        <div className="mda-list-item-text mda-2-line">
                          <h3>
                            <a href="#">Jessie Cox</a>
                          </h3>
                          <div className="text-muted text-ellipsis">Sed lacus nisl luctus</div>
                        </div>
                      </div>
                      <div className="mda-list-item">
                        <img src="img/user/03.jpg" alt="List user" className="mda-list-item-img" />
                        <div className="mda-list-item-text mda-2-line">
                          <h3>
                            <a href="#">Marie Hall</a>
                          </h3>
                          <div className="text-muted text-ellipsis">Donec congue sagittis mi</div>
                        </div>
                      </div>
                      <div className="mda-list-item">
                        <img src="img/user/04.jpg" alt="List user" className="mda-list-item-img" />
                        <div className="mda-list-item-text mda-2-line">
                          <h3>
                            <a href="#">Guy Carpenter</a>
                          </h3>
                          <div className="text-muted text-ellipsis">Donec convallis arcu sit</div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pv0 text-right">
                      <a href="#" className="btn btn-flat btn-info">
                        View all
                      </a>
                    </div>
                    <div className="card-divider" />
                    <h5 className="card-heading">Activity</h5>
                    <div className="card-body pb0">
                      <p className="pull-left mr">
                        <em className="ion-record text-info" />
                      </p>
                      <div className="oh">
                        <p>
                          <strong className="mr-sm">Added</strong>
                          <span className="mr-sm">a new issue</span>
                          <a href="#">#5478</a>
                        </p>
                        <div className="clearfix">
                          <div className="pull-left text-muted">
                            <em className="ion-android-time mr-sm" />
                            <span>an hour ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pb0">
                      <p className="pull-left mr">
                        <em className="ion-record text-danger" />
                      </p>
                      <div className="oh">
                        <p>
                          <strong className="mr-sm">Commented</strong>
                          <span className="mr-sm"> on the project</span>
                          <a href="#">Material</a>
                        </p>
                        <p className="bl pl">
                          <i>That's awesome!</i>
                        </p>
                        <div className="clearfix">
                          <div className="pull-left text-muted">
                            <em className="ion-android-time mr-sm" />
                            <span>2 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pb0">
                      <p className="pull-left mr">
                        <em className="ion-record text-success" />
                      </p>
                      <div className="oh">
                        <p>
                          <strong className="mr-sm">Completed</strong>
                          <span> all tasks asigned this week</span>
                        </p>
                        <div className="clearfix">
                          <div className="pull-left text-muted">
                            <em className="ion-android-time mr-sm" />
                            <span>3 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pb0">
                      <p className="pull-left mr">
                        <em className="ion-record text-info" />
                      </p>
                      <div className="oh">
                        <p>
                          <strong className="mr-sm">Published</strong>
                          <span className="mr-sm"> new photos on the album</span>
                          <a href="#">WorldTrip</a>
                        </p>
                        <p>
                          <a href="#">
                            <img src="img/pic4.jpg" alt="Pic" className="mr-sm thumb48" />
                          </a>
                          <a href="#">
                            <img src="img/pic5.jpg" alt="Pic" className="mr-sm thumb48" />
                          </a>
                          <a href="#">
                            <img src="img/pic6.jpg" alt="Pic" className="mr-sm thumb48" />
                          </a>
                        </p>
                        <div className="clearfix">
                          <div className="pull-left text-muted">
                            <em className="ion-android-time mr-sm" />
                            <span>4 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="clearfix">
                        <p className="pull-left mr">
                          <em className="ion-record text-primary" />
                        </p>
                        <div className="oh">
                          <p>
                            <strong className="mr-sm">Following</strong>
                            <span className="mr-sm">Jane Kuhn</span>
                          </p>
                          <p>
                            <span className="image-list">
                              <a href="#">
                                <img
                                  src="img/user/03.jpg"
                                  alt="User"
                                  className="img-circle thumb32"
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="img/user/04.jpg"
                                  alt="User"
                                  className="img-circle thumb32"
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="img/user/05.jpg"
                                  alt="User"
                                  className="img-circle thumb32"
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="img/user/06.jpg"
                                  alt="User"
                                  className="img-circle thumb32"
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="img/user/07.jpg"
                                  alt="User"
                                  className="img-circle thumb32"
                                />
                              </a>
                              <strong>
                                <a href="#" className="ml-sm link-unstyled">
                                  +200
                                </a>
                              </strong>
                            </span>
                          </p>
                          <div className="clearfix">
                            <div className="pull-left text-muted">
                              <em className="ion-android-time mr-sm" />
                              <span>yesterday</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
