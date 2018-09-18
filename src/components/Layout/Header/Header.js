import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import * as Values from '../../../constants/Values'

import { Dropdown, MenuItem } from 'react-bootstrap'

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

import './Header.scss'
import './HeaderMenuLinks.scss'

import RippleRun from '../../Ripple/Ripple.run'

class Header extends Component {
  constructor(props) {
    super(props)

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
        alert('need install scatter')
      }
    } catch (e) {
      // todo - error handle
      // 423 Locked
      if (e.code === Values.SCATTER_ERROR_LOCKED) {
        alert('Locked')
      }
    }
  }

  onLogoutClick = async () => {
    const { accountStore } = this.props

    await accountStore.logout()
  }

  render() {
    const ddMenuItem = (
      <span>
        <em className="ion-person" />
        <sup className="badge bg-danger">3</sup>
      </span>
    )

    return (
      <header className="header-container" style={{ marginLeft: '0px' }}>
        <nav>
          <ul className="visible-xs visible-sm">
            <li>
              <a id="sidebar-toggler" href="#" className="menu-link menu-link-slide">
                <span>
                  <em />
                </span>
              </a>
            </li>
          </ul>
          <ul className="hidden-xs">
            <li>
              <a id="offcanvas-toggler" href="#" className="menu-link menu-link-slide">
                <span>
                  <em />
                </span>
              </a>
            </li>
          </ul>
          <h2 className="header-title">
            <a href="#" style={{ color: 'white' }}>
              <span>EVERYEOS</span>
            </a>
          </h2>

          <ul className="pull-right">
            <li>
              <a href="#" className="ripple">
                <em className="icon ion-ios-search-strong" />
              </a>
            </li>
            <li>
              <a href="#" className="ripple">
                <em className="icon ion-gear-b" />
              </a>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}

export default compose(
  inject('accountStore'),
  observer
)(Header)
