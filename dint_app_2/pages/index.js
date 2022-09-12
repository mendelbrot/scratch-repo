import styled from 'styled-components'
import withData from '/components/hocs/withData'
import Link from 'next/link'
import withLayout from '/components/hocs/withLayout'
import compose from '/lib/compose'

const ListButton = styled.li`
  font-size: 50px;
  color: green;
  &:hover {
    background-color: yellow;
  }
`

function Home(props) {
  const { loading, error, data, getData } = props

  if (loading) { 
    return (
    <div>Loading...</div>
    )
  }
  
  if (error) {
    return (
      <ul>
        {error.map((err) => 
          <li key={err}>{err}</li>
        )}
      </ul>
    )
  }

  return (
    <div>
      <button onClick={getData}>Refresh</button>
      <ListButton>
        {data.map((item) =>
          <li key={item._id}>
            <Link href={`/books/${item._id}`}>
              <a>{item.name}</a>
            </Link>
          </li>
        )}
      </ListButton>
    </div>
  )
}

export default compose(
  withLayout(true),
  withData('/api/books')
)(Home)