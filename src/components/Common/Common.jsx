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
import ColorsConstant from '../Colors/ColorsConstant.js'

import { Container } from 'reactstrap'

export const NoPaddingCol = styled.div`
  padding: 0px;
  padding: 0px !important;
  background: white;
  border: ${props => (props.border ? 'solid 1px #d9d9d9' : '')};
`

export const PriceBack = styled.div`
  background-color: ${props => (props.up ? ColorsConstant.Thick_back_blue : props.down ? ColorsConstant.Thick_back_red : 'white')};
  height: 100%;
  color: ${props => (props.up ? ColorsConstant.Thick_back_blue : props.down ? ColorsConstant.Thick_back_red : 'white')};
  float: right;
  overflow: hidden;
`

export const PriceRow = styled.p`
  padding-top: 1px;
  margin-bottom: 0px;
  color: ${props =>
    props.up ? ColorsConstant.Thick_blue : props.down ? ColorsConstant.Thick_red : ColorsConstant.Thick_normal};
  font-size: 12px;
`

export const PriceIcon = styled.em`
  color: ${props => props.color};
`
export const Text = styled.span`
  color: ${props => props.color};
`

export const HeaderTable = styled.table`
  margin-bottom: 0 !important;
`

export const TokenPrice = styled.div`
  height: 44px;
  background: white;
  vertical-align: middle;
  text-align: center;
  font-size: 18px;
  padding: 8px;
`

export const Header6 = styled.h6`
  font-size: 16px;
  color: ${props => props.color};
  margin: 0px;
`

export const FavoriteIcon = styled.em`
  font-size: 25px;
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
