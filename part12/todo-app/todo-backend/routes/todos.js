const express = require('express');
const { getAsync, setAsync } = require('../redis');
const { Todo } = require('../mongo');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const current = await getAsync('added_todos');
  const count = current ? parseInt(current) : 0;
  await setAsync('added_todos', count + 1);
  res.send(todo);
});

router.get('/statistics', async (req, res) => {
  const current = await getAsync('added_todos');
  res.json({ added_todos: parseInt(current) || 0 });
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;

  if (text !== undefined) req.todo.text = text;
  if (done !== undefined) req.todo.done = done;

  const updateTodo = await req.todo.save();
  res.send(updateTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
