const { celebrate, Joi } = require('celebrate');

const regExpLink = /https?:\/\/(www.)?[-a-zA-Z0-9@:%._//+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_//+.~#?//=])*/;

module.exports.registerValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExpLink),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExpLink),
  }),
});

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regExpLink),
  }),
});

module.exports.idValidation = (id) => celebrate({
  params: Joi.object().keys({
    [id]: Joi.string().hex().length(24),
  }),
});
