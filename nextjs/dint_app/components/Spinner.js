import { Grid } from 'react-loader-spinner'
import styled from 'styled-components'

const CenterOverlay = styled.div`
  top: 50%;
  left: 50%;
  transform:translate(50%, 50%);
  // display: flex;
  // align-items: center;
  // justify-content: center;
`

export default function Spinner(props) {
  return (
    <CenterOverlay>
      <Grid color="fuchsia" height={80} width={80} />
    </CenterOverlay>
  )
}

