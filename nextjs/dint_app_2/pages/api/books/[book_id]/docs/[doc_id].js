import clientPromise from '/lib/api/mongodb'
import apiHandler from '/lib/api/apiHandler'
import { ObjectId } from 'mongodb'

const DATABASE = 'dint_2'

export default apiHandler({
  delete: delete_doc
})

async function delete_doc(req, res) {
  const book_id = req.query.book_id
  const doc_id = req.query.doc_id
  const delete_doc = req.query.delete && req.query.delete.toLowerCase() === 'true'
  if (!delete_doc) {
    throw 'set delete=true in query string to confirm deletion'
  }

  const client = await clientPromise
  const db = client.db(DATABASE)

  const delete_res = await db
    .collection(`docs.${book_id}`)
    .deleteOne({ _id: ObjectId(doc_id) })
    
  const doc_deleted = delete_res.deletedCount > 0
  if (!doc_deleted) {
    throw `doc ${doc_id} in book ${book_id} not found`
  }

  const response = {
    book_id,
    doc_id,
    doc_deleted
  }

  res.status(200).send(response)
}