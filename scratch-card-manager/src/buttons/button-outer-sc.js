import styled from 'styled-components'
import {border, colors, layout, neutrals} from '../constants'

const ButtonSC = styled.button.attrs({type: 'button'})`
  width: ${({fullWidth}) => (fullWidth ? '100%' : 'auto')};
  padding: 0;
  border: 1px solid ${colors.white};
  border-radius: ${border.radius};
  background: ${colors.white};
  outline: none;
  color: ${colors.white};
  vertical-align: middle;
  transition: 0.2s ease-out all;
  -webkit-appearance: none;
  &:active,
  &:focus {
    background: ${neutrals.neutral10};
    color: ${colors.white};
  }

  &[disabled] {
    background: ${colors.white};
    border-color: ${neutrals.neutral20};
    color: ${neutrals.neutral20};
  }

  ${({circle}) =>
    circle &&
    `
    border-radius: 100%;
  `};

  ${({pill}) =>
    pill &&
    `
    border-width: 3px;
    border-radius: ${layout.tapSize};
  `};

  ${({raised}) =>
    raised &&
    `
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    &:active {
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    }
  `};
`
export default ButtonSC