import styled from 'styled-components'
import Flex from './flex'

const neutrals = {
  neutral00: '#fff',
  neutral10: '#edf1f3',
  neutral15: '#dbdbdb',
  neutral20: '#d9dfe3',
  neutral25: '#8d9ba7',
  neutral30: '#727272',
  neutral40: '#3d464b',
  neutral50: '#000'
}

const borderConstant = {
  color: neutrals.neutral15,
  darkColor: neutrals.neutral40,
  radius: '4px',
  shorthand: `1px solid ${neutrals.neutral15}`
}
const Section = styled(Flex)`
  overflow-x: ${({overflowX}) => (overflowX ? overflowX : 'initial')};
  overflow-y: ${({overflowY}) => (overflowY ? overflowY : 'initial')};
  display: ${({display}) => (display ? display : 'block')};
  height: ${({height}) => (height ? height : 'auto')};
  max-height: ${({maxHeight}) => (maxHeight ? maxHeight : 'initial')};
  min-height: ${({minHeight}) => (minHeight ? minHeight : 'initial')};
  width: ${({width}) => (width ? width : 'auto')};
  max-width: ${({maxWidth}) => (maxWidth ? maxWidth : 'initial')};
  min-width: ${({minWidth}) => (minWidth ? minWidth : 'initial')};
  background: ${({background}) => (background ? background : 'none')};
  border: ${({border}) => (border ? borderConstant.shorthand : '0')};
  border-radius: ${({borderRadius}) => (borderRadius ? borderRadius : 0)};
  box-shadow: ${({boxShadow}) => (boxShadow ? boxShadow : 'none')};
  color: ${({color}) => (color ? color : 'inherit')};
  text-align: ${({textAlign}) => (textAlign ? textAlign : 'initial')};
  -webkit-overflow-scrolling: touch;
`

export default Section
