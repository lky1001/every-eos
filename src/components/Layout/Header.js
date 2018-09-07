import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import * as Values from '../../constants/Values'

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

class Header extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
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

  render() {
    const { accountStore } = this.props

    return (
      <header>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                {accountStore.isLogin ? (
                  <NavLink>{accountStore.loginAccountInfo.account_name}</NavLink>
                ) : (
                  <NavLink onClick={this.onLoginClick}>Login with Scatter</NavLink>
                )}
              </NavItem>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    )
  }
}

export default compose(
  inject('accountStore'),
  observer
)(Header)
