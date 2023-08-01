const { mongoose } = require('mongoose')
const mongooseURI = "mongodb+srv://zuhaibdev:0123456789@cluster0.darurr5.mongodb.net/"

mongoose.connect(mongooseURI).then(() => {
  console.log("Connect To Mongoose")
}).catch((err) => {
  console.log(err)
})
module.exports = mongoose;