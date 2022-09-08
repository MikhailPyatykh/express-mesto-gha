class ErrorsTemplate extends Error {
  INCORRECT_DATA(message) {
    this.statusCode = 400;
    this.message = message;
    return { statusCode: this.statusCode, message: this.message };
  }

  UNAUTHORIZED(message) {
    this.statusCode = 401;
    this.message = message;
    return { statusCode: this.statusCode, message: this.message };
  }

  ACCESS_DENIED(message) {
    this.statusCode = 403;
    this.message = message;
    return { statusCode: this.statusCode, message: this.message };
  }

  DATA_NOT_FOUND(message) {
    this.statusCode = 404;
    this.message = message;
    return { statusCode: this.statusCode, message: this.message };
  }

  CONFLICT_DATA(message) {
    this.statusCode = 409;
    this.message = message;
    return { statusCode: this.statusCode, message: this.message };
  }

  DEFAULT_ERROR() {
    this.statusCode = 500;
    return { statusCode: this.statusCode, message: 'На сервере произошла ошибка.' };
  }
}

module.exports = new ErrorsTemplate();
