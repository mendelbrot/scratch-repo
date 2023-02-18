import clientPromise from '/lib/api/mongodb'
import apiHandler from '/lib/api/apiHandler'
import { ObjectId } from 'mongodb'

const DATABASE = 'dint_2'

export default apiHandler({
  post: import_book
})

async function import_book(req, res) {
  const body = req.body
  const book = body.metadata
  book.created = book?.created || Date.now(),
  book.edited = Date.now()
  delete book._id

  const client = await clientPromise
  const db = client.db(DATABASE)

  let insertedId
  if (book.type === 'daily_log') {
    const lenses_input_key = Object.keys(body).filter((prop) => { return prop.indexOf('lenses') == 0 })[0]
    const docs_input_key = Object.keys(body).filter((prop) => { return prop.indexOf('docs') == 0 })[0]

    book.lenses = body[lenses_input_key]
    const docs = body[docs_input_key].map((item) => { return { ...item, _id: ObjectId(item._id) } })

    const insert_res = await db
      .collection('books')
      .insertOne(book)

    insertedId = insert_res.insertedId
    if (!insertedId) {
      throw `error creating book`
    }
    const docs_key = `docs.${insertedId}`
    
    await db
      .collection(docs_key)
      .insertMany(docs)
  } else {
    throw 'book type not supported'
  }

  res.status(200).json({ _id: insertedId })
}

