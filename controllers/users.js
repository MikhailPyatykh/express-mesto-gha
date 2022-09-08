const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;
const error = require('../utils/errorsTemplate');

// Создаём нового пользователя
module.exports.register = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хэш в базу
    })).then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(error.INCORRECT_DATA('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// Обработка входа пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, '+password')
    .orFail(() => {
      throw error.UNAUTHORIZED('Неверный логин или пароль');
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw error.UNAUTHORIZED('Неверный логин или пароль');
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
      throw error.DATA_NOT_FOUND('Пользователь с таким _id не найден');
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
      throw error.DATA_NOT_FOUND();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(error.INCORRECT_DATA_CODE('Переданы некорректные данные _id'));
      } else {
        next(err);
      }
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
      throw error.DATA_NOT_FOUND('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(error.INCORRECT_DATA('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
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
      throw error.DATA_NOT_FOUND('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(error.INCORRECT_DATA('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};
