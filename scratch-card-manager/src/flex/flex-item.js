import styled from 'styled-components'

import Spacing from '../spacing'

const FlexItem = styled(Spacing)`
  flex: ${({flex}) => flex || '1 1 auto'};
  min-width: 0;
`

export default FlexItem
