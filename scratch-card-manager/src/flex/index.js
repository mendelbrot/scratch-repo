import styled from 'styled-components'
import Spacing from '../spacing'

const Flex = styled(Spacing)`
  display: ${({inline}) => (inline ? 'inline-flex' : 'flex')};
  align-items: ${({alignItems}) => alignItems || 'initial'};
  justify-content: ${({justifyContent}) => justifyContent || 'initial'};
  flex-direction: ${({flexDirection}) => flexDirection || 'initial'};
`

Flex.displayName = 'Flex'

export default Flex
