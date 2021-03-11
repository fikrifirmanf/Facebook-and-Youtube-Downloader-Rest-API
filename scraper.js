const https = require('https')
const qs = require('querystring')
const cheerio = require('cheerio')

module.exports = {
    getAPI:async (req,res)=>{
        try {
            const options = {
                hostname: 'api.y2mate.guru',
                port: 443,
                path: '/api/convert',
                method: 'POST',
                headers: {
                    'Content-type':'application/json'
                }   
            }
            const body = JSON.stringify({
                url: req.query.url
            })
            let output = ""
            const request = https.request(options, async(resp)=>{
                resp.setEncoding('utf8')
                resp.on("data",function(chunk){
                    output += chunk
                }).on("end",()=>{
                    let body = JSON.parse(output)
                    console.log(body)
                    res.send(body)
                })
            })
            request.on('error',error =>{
                console.log(error)
            })

            request.write(body)
            request.end()
        } catch (error) {
            res.status(500).json({message:error})
        }
    },
    getApiFb: async(req, res)=>{
        try {
            const options = {
                hostname: 'fbdown.net',
                port: 443,
                path: '/download.php',
                method: 'POST',
                headers: {
                    'Content-type':'application/x-www-form-urlencoded'
                },
                maxRedirects: 20
            }
            const body = qs.stringify({
                URLz: req.query.url
            })
            console.log(`url ${body}`)
           
            const request = https.request(options, async(resp)=>{
                var output = []
                // resp.setEncoding('utf8')
                resp.on("data",function(chunk){
                    output.push(chunk)
                }).on("end",()=>{
                    let body = Buffer.concat(output).toString()
                    // console.log(output)
                    // res.send(body)
                    const $ = cheerio.load(body)
                var jsonData = []
               
                $('div#result').each(function (i, e) {
                    jsonData.push({})
                    const $e = $(e)
                    jsonData[i].imgUrl = $e.find('img.lib-img-show').attr('src')
                    jsonData[i].link = $e.find('a#sdlink').attr('href')
                    
                })
                if(resp.statusCode == 302){
                    res.status(302).json({status:resp.statusCode,message: "Video might be private or link error!"})
                }else {
                res.json({
                    'status': resp.statusCode,
                    'data': jsonData
                })}
                })
            })
            request.on('error',error =>{
                console.log(error)
            })

            request.write(body)
            request.end()
        } catch (error) {
            res.status(500).json({message:error})
        }
    }
}