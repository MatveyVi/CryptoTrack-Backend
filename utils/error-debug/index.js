function handleServerError(res, error, message) {
    console.error(`Error in ${message}:`, error)
    res.status(500).json({ error: 'Internal server error'})
}

module.exports = {handleServerError}
