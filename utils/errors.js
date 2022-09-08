const errors = {
  INCORRECT_DATA: {
    statusCode: 400,
    message: 'Неверные данные',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'Необходима авторизация',
  },
  ACCESS_DENIED: {
    statusCode: 403,
    message: 'Доступ запрещён',
  },
  DATA_NOT_FOUND: {
    statusCode: 404,
    message: 'Данные не найдены',
  },
  CONFLICT_DATA: {
    statusCode: 409,
    message: 'Неверные данные',
  },
  DEFAULT_ERROR: {
    statusCode: 500,
    message: 'На сервере произошла ошибка',
  },
};

module.exports = errors;
