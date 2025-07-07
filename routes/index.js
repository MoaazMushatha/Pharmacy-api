module.exports= (app) => {
     app.use('/auth', require('./authRoutes'))
     app.use('/pharmacies', require('./pharmacyRoutes'))
     app.use('/medicines', require('./medicineRoutes'))
}