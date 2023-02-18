import clientPromise from '/lib/api/mongodb'
import apiHandler from '/lib/api/apiHandler'
import { ObjectId } from 'mongodb'

const DATABASE = 'dint_2'

export default apiHandler({
  post: create_new_doc,
  put: replace_doc,
})

async function create_new_doc(req, res) {
  const book_id = req.query.book_id
  const doc = req.body
  delete doc._id

  const now = Date.now()
  doc.created = now
  doc.edited = now

  const client = await clientPromise
  const db = client.db(DATABASE)

  const { insertedId } = await db
    .collection(`docs.${book_id}`)
    .insertOne(doc)

  if (!insertedId) {
    throw `error creating doc`
  }

  res.status(200).json({ _id: insertedId })
}

async function replace_doc(req, res) {
  const book_id = req.query.book_id
  const doc = req.body

  const now = Date.now()
  doc.edited = now

  const client = await clientPromise
  const db = client.db(DATABASE)

  console.log(doc)

  // console.log(`docs.${book_id}`)

  const _id = doc._id
  doc._id = ObjectId(_id)
  const replace_res = await db
    .collection(`docs.${book_id}`)
    .replaceOne({ _id: doc._id }, { doc })

  console.log(replace_res)

  const matched = replace_res.matchedCount > 0
  if (!matched) {
    throw `doc ${book_id} in book ${book_id} not found`
  }

  res.status(200).json({_id, matched})
}