const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')
const config = require('./config/key')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

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

app.post('/api/users/register', (req, res) => {
  //회원 가입시 필요한 정보
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    console.log(user)
    return res.status(200).json({
      success: true,
    })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 아이디 비밀번호가 있는지 찾는다.
  //있다면 비밀번호가 비밀번호가 맞는지 확인
  //토큰을 생성

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      })
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        })
      }

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)

        //토큰을 저장한다. 어디에?  쿠키, 로컬스토리지 등 여러가지 방법이 있음
        res.cookie('x_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  //Auth true일때 수행
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role == 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.role,
    lastname: req.user.lastname,
    role: req.user.role,
    role: req.user.iamge,
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  console.log('get logout')
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      token: '',
    },
    (err, user) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).send({
        success: true,
      })
    }
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
