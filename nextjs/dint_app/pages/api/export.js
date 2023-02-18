import clientPromise from '/lib/api/mongodb'
import apiHandler from '/lib/api/apiHandler'
import { ObjectId } from 'mongodb'

const DATABASE = 'dint_2'

export default apiHandler({
  get: export_book
})

async function export_book(req, res) {
  const book_id = req.query.book

  const client = await clientPromise
  const db = client.db(DATABASE)
  const book = await db
    .collection('books')
    .findOne({ _id: ObjectId(book_id) })

  if (!book) {
    throw `book ${book_id} not found`
  }
  
  let response = {}
  if (book.book_type = 'daily_log') {
    const lenses_name = `lenses.${book_id}`
    const docs_name = `docs.${book_id}`
    const lenses = book.lenses
    delete book.lenses

    const docs = await db
      .collection(docs_name)
      .find({})
      .sort({ date: -1 })
      .toArray()

    response = {
      metadata: book,
      [lenses_name]: lenses,
      [docs_name]: docs
    }

    res.status(200).json(response)
  }
}
