module.exports = (res, statusCode, status, message, data) => {
    console.log('here in returnJson')
    res.status(statusCode).json({
        status: {
            status: status,
            message: message
        },
        data: data
    })
}