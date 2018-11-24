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
import { Container, Col, Button } from 'reactstrap'

export const OrderBaseColumn = styled.td`
  width: 10%;
  text-align: right;
`

const TypeColumnBase = styled(OrderBaseColumn)`
  width: 5%;
`

export const DateColumn = styled(OrderBaseColumn)`
  width: 15%;
  text-align: center !important;
`

export const BuyTypeColumn = styled(TypeColumnBase)`
  color: ${ColorsConstant.Thick_green};
`

export const SellTypeColumn = styled(TypeColumnBase)`
  color: ${ColorsConstant.Thick_red};
`

export const RightAlignCol = styled(Col)`
  text-align: right;
`

export const NoMarginPaddingCol = styled(Col)`
  padding: 0;
  margin: 0;
`

export const NoPaddingCol = styled.div`
  padding: 0px;
  padding: 0px !important;
  background: white;
  border-right: ${props => (props.showBorderRight ? '1px solid #d9d9d9' : '')};
  border-left: ${props => (props.showBorderLeft ? '1px solid #d9d9d9' : '')};
  border-top: ${props => (props.showBorderTop ? '1px solid #d9d9d9' : '')};
  border-bottom: ${props => (props.orderBottom ? '1px solid #d9d9d9' : '')};
`

export const PriceBack = styled.div`
  background-color: ${props =>
    props.down
      ? ColorsConstant.Thick_back_red
      : props.up
        ? ColorsConstant.Thick_back_green
        : 'white'};
  height: 100%;
  color: ${props =>
    props.down
      ? ColorsConstant.Thick_back_red
      : props.up
        ? ColorsConstant.Thick_back_green
        : 'white'};
  float: right;
  overflow: hidden;
  width: ${props => props.width + '%'};
`

export const PriceRow = styled.p`
  padding-top: 7px;
  margin-bottom: 0px;
  color: ${props =>
    props.up
      ? ColorsConstant.Thick_green
      : props.down
        ? ColorsConstant.Thick_red
        : ColorsConstant.Thick_normal};
  font-size: 12px;
  position: ${props => props.position && props.position};
  right: ${props => props.right && props.right};
`

export const PriceIcon = styled.em`
  color: ${props => props.color};
`

export const InfoIcon = styled.em`
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
  font-size: 14px;
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

export const CommonSearchBoxDiv = styled.div`
  display: flex;
  align-items: center;
  width: 132px;
  padding: 16px;
`

export const TableMdRow = styled.tr`
  line-height: 32px;
  min-height: 32px;
  height: 32px;

  &:hover {
    font-weight: 700;
    cursor: pointer;
    background-color: ${ColorsConstant.grayLighter};
  }
`

export const TableLgRow = styled(TableMdRow)`
  line-height: 38px;
  min-height: 38px;
  height: 38px;
  font-size: 1.2rem;
`

export const BaseLargeButton = styled(Button)`
  height: 36px;
`

export const MarketHeader = styled.th`
  font-size: 14px !important;
`

export const TopView = styled.div`
  height: 400px;
`
