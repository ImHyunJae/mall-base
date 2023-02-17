const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { User } = require('./models/user')
const config = require('./config/key')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.set('strictQuery', true)
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoose db connect'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! node mon is working')
})

app.post('/register', (req, res) => {
  //회원 가입시 필요한 정보
  console.log('/register in')
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
