const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minLength: 5,
  },
  lastname: {
    type: String,
    maxLength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
})

userSchema.pre('save', function (next) {
  //비밀번호를 암호화
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)

        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function (cb) {
  //jsonwebtoken 이용 token 생성
  let user = this
  const token = jwt.sign(user._id.toHexString(), 'secretToken')
  console.log(token)
  user.token = token
  user.save(function (err, user) {
    if (err) {
      console.log('save error')
      return cb(err)
    }
    cb(null, user)
  })
}

userSchema.statics.findByToken = function (token, cb) {
  let user = this
  console.log('findByToken')
  //토큰을 디코드
  jwt.verify(token, 'secretToken', function (err, decoded) {
    //유저를 찾은 후
    //클라이언트에서 가져온 token과 DB에서 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
