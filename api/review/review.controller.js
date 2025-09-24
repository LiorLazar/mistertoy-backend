import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"
import { toyService } from "../toy/toy.service"
import { reviewService } from "./review.service.js"


export async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        loggerService.error('Cannot get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

export async function deleteReview(req, res) {
    var { loggedinUser } = req
    const { id: reviewId } = req.params

    try {
        const deletedCount = await reviewService.remove(reviewId)
        res.send(deletedCount)
    } catch (err) {
        loggerService.error('Cannot remove review', err)
        res.status(500).send({ err: 'Failed to remove review' })
    }
}

export async function addReview(req, res) {
    var { loggedinUser } = req

    try {
        var review = req.body
        const { aboutToyId } = review
        review.byUserId = loggedinUser._id
        review = await reviewService.add(review)

        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        review.byUser = loggedinUser
        review.aboutToyId = await toyService.getById(aboutToyId)

        delete review.aboutUser.givenReviews
        delete review.aboutToyId
        delete review.byUserId

        res.send(review)
    } catch (err) {
        loggerService.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}