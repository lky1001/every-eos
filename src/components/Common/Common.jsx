import './Animate.scss'
import './ButtonsExtra.scss'
import './DropdownExtra.scss'
import './GridExtra.scss'
import './Modal.scss'
import './Spinner.scss'
import './Themes.scss'
import './Typography.scss'
import './UiCheckboxRadio.scss'
import './UiNoteArea.scss'
import './UiSwitch.scss'
import styled from 'styled-components'

import { Container } from 'reactstrap'

export const PriceBack = styled.div`
  background-color: ${props => props.up ? '#ddedfe' : '#fee9f1'};
  height: 100%;
  color: ${props => props.up ? '#ddedfe' : '#fee9f1'};
  float: right;
  overflow: hidden;
`

export const PriceRow = styled.p`
  padding-top: 1px;
  margin-bottom: 0px;
  color: #6c7177;
  font-size: 12px;
`

export const PriceIcon = styled.em`
  color: ${props => props.color};
`

export const Text = styled.span`
  color: ${props => props.color};
`

export const OrderListTable = styled.table`
  margin-bottom: 0 !important;
`

export const TokenPrice = styled.div`
  height: 30px;
  background: #d9d9d9;
  vertical-align: middle;
  text-align: center;
  font-size: 18px;
  padding-top: 3px;
`


export const Header6 = styled.h6`
  font-size: 14px;
  color: ${props => props.color};
  margin: 0px;
`

export const FavoriteIcon = styled.em`
  font-size: 20px;
`

export const CardContainer = styled(Container)`
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  position: relative;
`

export const ShadowedCard = styled(CardContainer)`
  box-shadow: 0 8px 38px rgba(133, 133, 133, 0.3), 0 5px 12px rgba(133, 133, 133, 0.22);
`

export const InputPairContainer = styled.div`
  display: flex;
  align-items: center;
`
