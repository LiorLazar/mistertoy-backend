import { ObjectId } from 'mongodb'

import { asyncLocalStorage } from '../../services/als.service.js'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { pipeline } from 'stream'

export const reviewService = { query, remove, add }

async function query(filterBy = {}) {
  try {

    const { loggedinUser } = asyncLocalStorage.getStore()
    // console.log(loggedinUser);

    filterBy.byUserId = loggedinUser._id
    // filterBy.aboutToyId = loggedinUser._id
    const criteria = _buildCriteria(filterBy)
    // console.log(criteria);

    const collection = await dbService.getCollection('review')

    var reviewsCurser = await collection.aggregate([
      { $match: criteria },
      {
        $lookup: {
          from: 'user',
          foreignField: '_id',
          localField: 'byUserId',
          as: 'byUser',
          pipeline: [
            { $set: { 'userId': '$_id' } },
            { $unset: ['_id', 'password'] }
              
          ]
        }
      },
      { $set:  {byUser: { $arrayElemAt: [ "$byUser", 0 ] } }},
      {
        $lookup: {
          from: 'toy',
          foreignField: '_id',
          localField: 'aboutToyId',
          as: 'aboutToy',
          pipeline:[
            {$set:{toyId:'$_id'}},
            {$unset:['_id']}
          ]

        }
      },
      { $unwind: '$aboutToy' },
      {
        $project: {
          byUserId: 0,
          aboutToyId: 0,
          'aboutToy.labels': 0,
          'aboutToy.createdAt': 0,
          msgs: 0
        }
      },
   
       

    ])

    const reviews = reviewsCurser.toArray()

    return reviews
  } catch (err) {
    loggerService.error('cannot get reviews', err)
    throw err
  }
}

async function remove(reviewId) {
  try {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const collection = await dbService.getCollection('review')

    const criteria = { _id: ObjectId.createFromHexString(reviewId) }
    //* remove only if user is owner/admin
    //* If the user is not admin, he can only remove his own reviews by adding byUserId to the criteria
    if (!loggedinUser.isAdmin) {
      criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
    }

    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    loggerService.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      byUserId: ObjectId.createFromHexString(review.byUserId),
      aboutToyId: ObjectId.createFromHexString(review.aboutToyId),
      txt: review.txt,
    }
    const collection = await dbService.getCollection('review')
    await collection.insertOne(reviewToAdd)
    return reviewToAdd
  } catch (err) {
    loggerService.error('cannot add review', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.byUserId) {
    criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
  }

  // if (filterBy.aboutToyId) {
  //   criteria.aboutToyId = ObjectId.createFromHexString('668fba5ca1e5df1b7ae7864a')
  // }
  return criteria
}
