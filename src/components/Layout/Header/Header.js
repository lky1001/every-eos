import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { FormattedMessage } from 'react-intl'
import { SCATTER_ERROR_LOCKED, supportLanguage } from '../../../constants/Values'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { Dropdown, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { withAlert } from 'react-alert'

import * as Utils from '../../../utils/Utils'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Link } from 'react-router-dom'
import './Header.scss'
import './HeaderMenuLinks.scss'

import RippleRun from '../../Ripple/Ripple.run'

const CustomSwal = withReactContent(Swal)

class Header extends Component {
  constructor(props) {
    super(props)

    this.locales = supportLanguage.slice()
    this.selectedLocale = localStorage.getItem('locale')

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {
    RippleRun()
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onLoginClick = async () => {
    try {
      const { accountStore } = this.props

      const result = await accountStore.login()

      if (!result) {
        CustomSwal.fire({
          onOpen: () => {
            CustomSwal.clickConfirm()
          }
        }).then(() => {
          return CustomSwal.fire(<p>Please Install Scatter.</p>)
        })
      }
    } catch (e) {
      // todo - error handle
      // 423 Locked
      if (e.code === SCATTER_ERROR_LOCKED) {
        this.props.alert.show('Scatter is locked.')
      }
    }
  }

  onLogoutClick = async () => {
    const { accountStore } = this.props

    await accountStore.logout()
  }

  render() {
    const { accountStore } = this.props
    const location = window.location.pathname
    const params = Utils.getJsonFromUrl()

    return (
      <header className="header-container" style={{ marginLeft: '0px' }}>
        <nav>
          <h2 className="header-title">
            <Link to="/" style={{ color: 'white' }}>
              <img src="favicon.png" style={{ width: '27px', marginTop: '-4px' }} /> EVERYEOS beta
            </Link>
          </h2>
          <h6 className="header-title" style={{ fontSize: '15px', marginLeft: '30px' }}>
            <Link to="/trades/karma" style={{ color: 'white' }}>
              <FormattedMessage id="EXCHANGE" />
            </Link>
          </h6>
          <h6 className="header-title" style={{ fontSize: '15px' }}>
            <Link to="/markets" style={{ color: 'white' }}>
              <FormattedMessage id="MARKET" />
            </Link>
          </h6>

          <ul className="pull-right">
            <li>
              {accountStore.isLogin ? (
                <a className="ripple" onClick={this.onLogoutClick}>
                  <h6>{accountStore.loginAccountInfo.account_name}</h6>
                </a>
              ) : (
                <a className="ripple" onClick={this.onLoginClick}>
                  <h6>
                    <FormattedMessage id="SignIn" />
                  </h6>
                </a>
              )}
            </li>
            <li>
              {accountStore.isLogin && (
                <Link to="/orders" style={{ color: 'white' }}>
                  <h6>
                    <FormattedMessage id="Orders" />
                  </h6>
                </Link>
              )}
            </li>
            <li>
              {accountStore.isLogin && (
                <Link to="/wallets" style={{ color: 'white' }}>
                  <h6>
                    <FormattedMessage id="Wallet" />
                  </h6>
                </Link>
              )}
            </li>
            <Dropdown
              id="basic-nav-dropdown"
              pullRight
              componentClass="li"
              style={{ paddingTop: '3px' }}
            >
              <Dropdown.Toggle
                useAnchor
                noCaret
                className="has-badge ripple"
                style={{ fontSize: '16px' }}
              >
                <FormattedMessage id="LANG" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="md-dropdown-menu">
                {this.locales.map((locale, idx) => {
                  params['lang'] = locale
                  return (
                    <LinkContainer to={location + '?' + Utils.getUrlFromJson(params)} key={idx}>
                      <MenuItem eventKey={idx}>
                        <span style={{ fontSize: '13px' }}>{locale}</span>
                      </MenuItem>
                    </LinkContainer>
                  )
                })}
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </nav>
      </header>
    )
  }
}

export default withAlert(
  compose(
    inject('accountStore'),
    observer
  )(Header)
)
