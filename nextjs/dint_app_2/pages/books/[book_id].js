import { useState, useEffect } from 'react'
import styled from 'styled-components'
import withData from '/components/hocs/withData'
import { useRouter } from 'next/router'

const ListButton = styled.li`
  font-size: 50px;
  color: green;
  &:hover {
    background-color: yellow;
  }
`

function Book(props) {
  const { loading, error, data, getData } = props
  console.log(props)

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

  const { book, docs } = data || {}

  return (
    <div>
      <button onClick={getData}>Refresh</button>
      <h1>{book?.name}</h1>
      <ul>
        {docs?.map((item) =>
          <li key={item._id}>{item.date}</li>
        )}
      </ul>
    </div>
  )
}

export default function bookWithData(props) {
  const router = useRouter()
  const { book_id } = router.query
  const uri = book_id && `/api/books/${encodeURIComponent(book_id)}`

  return withData(Book, uri)(props)
}