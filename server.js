import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'

import { loggerService } from './services/logger.service.js'

const app = express()
console.log(process.env.MY_VAR);


// App Configuration
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body

// Serve static files in all environments
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    // Additional production configurations can go here
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'


// TEMP IMPORTS
import { dbService } from './services/db.service.js'
import { ObjectId } from 'mongodb'

app.all('*', setupAsyncLocalStorage)

// app.use(async (req, res, next) => {
//   try {
//     const toysCurser = await dbService.getCollection('toy')
//     const toys = await toysCurser.aggregate([
//       {$match:{"inStock": true,}},

//       {$addFields:{
//         isSelected:false
//       }},
//       {$set:{'toyName':'$name'}},
//         {$project:['labels','createdAt','msgs','name'].reduce((acc, curr)=>{
//         acc[curr]=0
//         return acc
//       },{})
//       },
//     ]).toArray()
//     return res.json(toys)
//   } catch (err) {
//     next(err)
//   }
// });


app.use('/api/toy', toyRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)

// Fallback - only for non-API routes and non-static files
app.get('*', (req, res) => {
    // Don't serve HTML for API routes or asset files
    if (req.path.startsWith('/api') || req.path.includes('.')) {
        return res.status(404).send('Not found')
    }
    res.sendFile(path.resolve('public/index.html'))
})

// Listen will always be the last line in our server!
const port = process.env.PORT || 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://localhost:${port}/`)
})
