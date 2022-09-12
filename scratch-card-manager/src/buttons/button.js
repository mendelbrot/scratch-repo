import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {marginSpacing} from '../spacing'

import ButtonOuterSC from './button-outer-sc'
import ButtonInnerSC from './button-inner-sc'

/**
 * Returns ButtonSC based on CSS props
 * @param {Object} props object containing CSS styling properties
 * @returns {JSX} ButtonSC styled based on props
 */
const Button = (props) => {
  const {children, circle, leftAligned, pill, size} = props

  // children={null} is used to prevent infinite children
  // prettier-ignore
  return (
    <ButtonOuterSC {...props} children={null}>
      <ButtonInnerSC
          circle={circle}
          size={size}
          leftAligned={leftAligned}
          pill={pill}
      >
        {children}
      </ButtonInnerSC>
    </ButtonOuterSC>
  )
}

/* eslint-enable react/no-children-prop */
Button.propTypes = {
  children: PropTypes.node,
  circle: PropTypes.bool,
  leftAligned: PropTypes.bool,
  pill: PropTypes.bool,
  raised: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

const ButtonSC = styled(Button)`
  ${marginSpacing};
`
export default ButtonSC