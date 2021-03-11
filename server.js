const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const scraper = require('./scraper')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(helmet())

app.get('/api/v1/yt',scraper.getAPI)
app.get('/api/v1/fb',scraper.getApiFb)
app.get('*',(req,res)=>{
        res.status(404).send("<title>Not Found!</title><h1>I Love U :*</h1>")
})


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
