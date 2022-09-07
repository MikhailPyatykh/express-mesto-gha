const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;
const status = require('../utils/errors');

// Создаём нового пользователя
module.exports.register = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((email) => {
      if (email) {
        throw status.CONFLICT_DATA;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хэш в базу
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        },
      }); // отправляем ответ без данных о пароле
    })
    .catch((err) => {
      next(err);
    });
};

// Обработка входа пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, '+password')
    .orFail(() => {
      throw status.UNAUTHORIZED;
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw status.UNAUTHORIZED;
      }
      const { _id } = user;
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    }))
    .catch((err) => {
      next(err);
    });
};

// Возвращаем всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

// Возвращаем информацию о текущем пользователе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw status.DATA_NOT_FOUND;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

// Возвращаем пользователя по идентификатору
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw status.DATA_NOT_FOUND;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

//  Обновляем профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw status.DATA_NOT_FOUND;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

//  Обновляем аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw status.DATA_NOT_FOUND;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};
