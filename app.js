const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('common'))

const playApps = require('./playstore.js')

app.get('/', (req, res) => {
  //code goes here
  console.log('things are happening!!!')
})

app.get('/apps', (req, res) => {
  const { search = "", sort = "", genres = "" } = req.query

  //validation for sort
  if (sort) {
    if (!['App', 'Rating'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be App or Rating')
    }
  }
  //validation for genre
  if (genres) {
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade or Card')
    }
  }

  // filter by search
  let results = playApps
    .filter(playApp =>
      playApp
        .App
        .toLowerCase()
        .includes(search.toLowerCase()))


  // filter by genres
  if (genres) {
    results = results
      .filter(result => 
        result
          .Genres
          .includes(genres)
      )

  }
  //sort 
  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : -1
    })
  }


  res.json(results)
})


app.listen(8001, () => {
  console.log('Server started on PORT 8001...')
})