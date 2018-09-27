import React from 'react'
import CircularProgressbar from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function StyledProgressbar(props) {
  return (
    <CircularProgressbar
      percentage={props.percentage}
      text={props.text}
      // Path width must be customized with strokeWidth,
      // since it informs dimension calculations.
      strokeWidth={5}
      // You can override styles either by specifying this "styles" prop,
      // or by overriding the default CSS here:
      // https://github.com/iqnivek/react-circular-progressbar/blob/master/src/styles.css
      styles={{
        text: {
          // Tweak text color:
          fill: '#000',
          // Tweak text size:
          fontSize: '22px'
        }
      }}
    />
  )
}
export default StyledProgressbar
