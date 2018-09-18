import './Ripple.scss'
import Ripple from './Ripple'
import $ from 'jquery'

function initRipple() {
  $('.ripple').each(function() {
    new Ripple($(this))
  })
}

export default initRipple
