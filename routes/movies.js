import { Router } from 'express'

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from '../models/movie.js'
// remove soon
import { readJSON } from '../utils.js'
const movies = readJSON('./movies.json')

export const moviesRouter = Router()

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query
  const movies = await MovieModel.getAll(genre)
  res.json(movies)
})

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const movie = await MovieModel.getById({ id })
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', async (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = await MovieModel.create({ input: result.data })

  res.status(201).json(newMovie)
})

moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  const result = await MovieModel.delete(id)

  return result
    ? res.json({ message: 'Movie deleted' })
    : res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.patch('/:id', async (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params

  const updatedMovie = await MovieModel.update({ id, input: result.data })
  if (updatedMovie === false) return res.status(404).json({ message: 'Movie not found' })

  return res.json(updatedMovie)
})
