import clientPromise from '/lib/api/mongodb'
import apiHandler from '/lib/api/apiHandler'
import { ObjectId } from 'mongodb'

const DATABASE = 'dint_2'

export default apiHandler({
  get: get_book,
  delete: delete_book
})

async function get_book(req, res) {
  const book_id = req.query.book_id
  console.log(book_id)

  const client = await clientPromise
  const db = client.db(DATABASE)

  const book = await db
    .collection('books')
    .findOne({ _id: ObjectId(book_id) })

  if (!book) {
    throw `book ${book_id} not found`
  }

  let docs
  if (book.type === 'daily_log') {
    docs = await db
      .collection(`docs.${book_id}`)
      .find({})
      .sort({ date: -1 })
      .toArray()
  } else {
    docs = await db
      .collection(`docs.${book_id}`)
      .find({})
      .sort({ edited: -1 })
      .toArray()
  }

  const response = {
    book,
    docs
  }

  res.status(200).json(response)
}

async function delete_book(req, res) {
  const book_id = req.query.book_id
  const delete_book = req.query.delete && req.query.delete.toLowerCase() === 'true'
  if (!delete_book) {
    throw 'set delete=true in query string to confirm deletion'
  }

  const client = await clientPromise
  const db = client.db(DATABASE)

  const delete_res = await db
    .collection('books')
    .deleteOne({ _id: ObjectId(book_id)})
  
  const book_deleted = delete_res.deletedCount > 0
  if (!book_deleted) {
    throw `book ${book_id} not found`
  }

  let docs_deleted = true
  try {
    await db
      .collection(`docs.${book_id}`)
      .drop()
  } catch (error) {
    docs_deleted = false
  }

  const response = {
    book_id,
    book_deleted,
    docs_deleted
  }

  res.status(200).send(response)
}

