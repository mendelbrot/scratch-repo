import clientPromise from '/lib/api/mongodb'
import apiHandler from '/lib/api/apiHandler'

const DATABASE = 'dint_2'

export default apiHandler({
  get: get_books_metadata,
  post: create_new_book
})

async function get_books_metadata (req, res) {
  const client = await clientPromise
  const db = client.db(DATABASE)
  const docs = await db
    .collection('books')
    .find({})
    .sort({ edited: -1 })
    .toArray()

  res.status(200).json(docs)
}

async function create_new_book(req, res) {
  const book = req.body

  const now = Date.now()
  book.created = now
  book.edited = now

  const client = await clientPromise
  const db = client.db(DATABASE)

  const { insertedId } = await db
    .collection('books')
    .insertOne(book)
  
  if (!insertedId) {
    throw `error creating book`
  }

  res.status(200).json({ _id: insertedId })
}
