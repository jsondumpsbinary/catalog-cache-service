// Express identifies this as an error handler because it has 4 parameters: (err, req, res, next)
function errorHandler(err, req, res, next) {
    console.error("🔥 [GLOBAL ERROR HANDLER]:", err.stack || err.message);

    // If the error object already specifies a custom status code, use it. Otherwise, default to 500.
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: err.message || "Internal Server Error"
    });
}

module.exports = errorHandler;