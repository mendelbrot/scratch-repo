import styled from 'styled-components'

import {colors} from '../../constants'
import Button from '../button'

const PrimaryButton = styled(Button)`
  background: ${colors.button};
  color: ${colors.white};

  &:focus {
    background: ${colors.button};
    color: ${colors.white};
  }

  &:active {
    background: ${colors.buttonHovered};
    color: ${colors.white};
  }
  &[disabled] {
    background: ${colors.button};
    border-color: ${colors.button};
    color: ${colors.white};
  }
`
export default PrimaryButton