import styled from 'styled-components'
import {colors} from '../../constants'
import PrimaryButton from './primary-button'

export default styled(PrimaryButton)`
  ${({outline}) =>
    outline &&
    `
  border-color: ${colors.white};
`};
`
