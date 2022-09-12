import { useState, useEffect } from 'react'
import styled from 'styled-components'
import withData from '/components/hocs/withData'
import withReduxStore from '/components/hocs/withReduxStore'
import { useRouter } from 'next/router'
import withLayout from '/components/hocs/withLayout'
import compose from '/lib/compose'
import Spinner from '/components/Spinner'

const ListButton = styled.li`
  font-size: 50px;
  color: green;
  &:hover {
    background-color: yellow;
  }
`

const Background = styled.div`
  min-height: 800
`

function Book(props) {
  const { loading, error, data, getData } = props

  if (loading) {
    return (
      <Spinner/>
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

  const { book, docs } = data || {}

  return (
    <Background>
      {/* <Spinner /> */}
      <button onClick={getData}>Refresh</button>
      <h1>{book?.name}</h1>
      <ul>
        {docs?.map((item) =>
          <li key={item._id}>{item.date}</li>
        )}
      </ul>
    </Background>
  )
}

export default function bookWithData(props) {
  const router = useRouter()
  const { book_id } = router.query
  const uri = book_id && `/api/books/${encodeURIComponent(book_id)}`

  return compose(
    withReduxStore,
    withLayout(false),
    withData(uri)
  )(Book)(props)
}