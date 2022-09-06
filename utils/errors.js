const errors = {
  INCORRECT_DATA: {
    statusCode: 400,
    error: "Incorrect data",
    message: "Correct data required",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    error: "Authorization failed",
    message: "Authorization required",
  },
  ACCESS_DENIED: {
    statusCode: 403,
    error: "Access error",
    message: "Access denied",
  },
  DATA_NOT_FOUND: {
    statusCode: 404,
    error: "Data error",
    message: "Data not found",
  },
  CONFLICT_DATA: {
    statusCode: 409,
    error: "Conflict data error",
    message: "Conflict data",
  },
  DEFAULT_ERROR: {
    statusCode: 500,
    error: "Default error",
    message: "An error occurred",
  },
};

module.exports = errors;
