import { useState, useEffect } from 'react'
import { curry11 } from '/lib/compose'

function withData(uri, WrappedComponent) {
  return function withDataComponent(props) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const getData = () => {
      setData(null)
      setError(null)
      setLoading(true)
      
      if (uri) {
        fetch(uri)
          .then(async (res) => {
            const status = res.status
            const contentType = res.headers.get('content-type')
            const isJson = contentType?.includes('application/json')
            const dat = isJson ? await res.json() : null

            if (status !== 200) {
              const errs = [`status: ${res.status}`]
              const message = dat?.message
              if (message) {
                errs.push(message)
              }
              setError(errs)
            } else if (!isJson) {
              setError([`response content-type header ${contentType} not application/json`])
            } else {
              setData(dat)
            }
            setLoading(false)
          }).catch((err) => {
            setError(['an unknown error occurred'])
            setLoading(false)
          })
      }
    }

    useEffect(() => {
      getData()
    }, [uri])

    return (
      <WrappedComponent
        data={data}
        error={error}
        loading={loading}
        getData={getData}
        {...props}
      />
    )
  }
  
}

export default curry11(withData)