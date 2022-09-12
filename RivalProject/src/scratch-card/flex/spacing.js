import styled from 'styled-components'
import {spacing} from './constants'

const setSpacingValue = (unit, direction) => {
  const value = direction || unit

  return value ? spacing[value] || value : 0
}

const calcSpacingValues = (
  spacingUnit,
  topDirection,
  rightDirection,
  bottomDirection,
  leftDirection
) => {
  const top = setSpacingValue(spacingUnit, topDirection)
  const right = setSpacingValue(spacingUnit, rightDirection)
  const bottom = setSpacingValue(spacingUnit, bottomDirection)
  const left = setSpacingValue(spacingUnit, leftDirection)

  return `${top} ${right} ${bottom} ${left}`
}

export const marginSpacing = (props) =>
  calcSpacingValues(
    props.margin,
    props.marginTop,
    props.marginRight,
    props.marginBottom,
    props.marginLeft
  )

const paddingSpacing = (props) =>
  calcSpacingValues(
    props.padding,
    props.paddingTop,
    props.paddingRight,
    props.paddingBottom,
    props.paddingLeft
  )

const Spacing = styled.div`
  margin: ${marginSpacing};
  padding: ${paddingSpacing};
`

export default Spacing
