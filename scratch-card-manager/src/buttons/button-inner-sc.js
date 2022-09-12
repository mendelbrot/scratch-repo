import styled from 'styled-components'
import {
  fontSizes,
  fontWeight,
  layout,
  spacing,
  typography,
  unit,
} from '../constants'

const ButtonInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${unit * 8}px;
  min-height: ${unit * 4.25}px;
  padding: ${layout.unit} ${spacing.md};
  font-family: ${typography.fontFamily};
  font-weight: ${fontWeight.semiBold};
  text-align: center;
`

const sizeConfig = {
  sm: '24px',
  md: '32px',
  lg: '44px',
}

/**
 * Returns CSS dimensions based on size
 * @param {Object} object CSS object may or may not have size
 * @returns {string} CSS properties as string
 */
const dimensions = ({size}) =>
  size &&
  `
    min-width: ${sizeConfig[size] ? sizeConfig[size] : `${unit * 8}px`};
    min-height: ${sizeConfig[size] ? sizeConfig[size] : `${unit * 4.25}px`};
    padding-right: ${spacing.xlg};
    padding-left: ${spacing.xlg};
  `

/**
 * Returns CSS dimensions based on pill
 * @param {Object} object CSS object may or may not have pill
 * @returns {string} CSS properties as string
 */
const pillStyles = ({pill}) =>
  pill &&
  `
    padding-right: ${layout.tapSize};
    padding-left: ${layout.tapSize};
    font-size: ${fontSizes.small};
    letter-spacing: 0.05em;
  `

/**
 * Returns CSS dimensions based on cricle and size
 * @param {Object} object CSS object may or may not have circle
 * @returns {string} CSS properties as string
 */
const circleStyles = ({circle, size}) =>
  circle &&
  `
    min-width: ${sizeConfig[size] ? sizeConfig[size] : '44px'};
    min-height: ${sizeConfig[size] ? sizeConfig[size] : '44px'};
    padding: 0;

    ${size === 'sm' &&
      `
      svg {
        width: 16px;
        height: 16px;
      }
    `}
  `

/**
 * Returns CSS dimensions based on leftAligned
 * @param {Object} object CSS object may or may not have leftAligned
 * @returns {string} CSS properties as string
 */
const alignment = ({leftAligned}) =>
  leftAligned &&
  `
    text-align: left;
    justify-content: flex-start;
  `

/**
 * @prop {boolean} leftAligned
 * @prop {boolean} pill
 * @prop {boolean} circle
 * @prop {string}  size - [sm, md, lg]
 */
const ButtonInnerSC = styled(ButtonInner)`
  ${dimensions};
  ${alignment};
  ${circleStyles};
  ${pillStyles};
`
export default ButtonInnerSC