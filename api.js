const express = require('express');
const cors = require('cors');
const request = require('request');
const app = express();
const superagent = require('superagent');
const bodyParser = require('body-parser');


const port = process.env.PORT || 6700;
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('<a href="https://github.com/login/oauth/authorize?client_id=92bbe6baf02b48b27a97">Login with git</a>');
})



app.post('/users',(req,res)=>{
    console.log('>>>>',req.body);
    const code = req.body.code;

    if(!code)
    {
        res.send({
            success:false,
            message:'code not found'
        })
    }

    superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
            client_secret:'0b027b41e6400e1b742098ecebe7b7f845527892',
            client_id:'92bbe6baf02b48b27a97',
            code:code
        })
        .set('Accept','application/json')
        .end((err,result)=>{
            if(err) throw err;
            var acctoken = result.body.access_token
            console.log(result);
            const option ={
                url:'https://api.github.com/user',
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'Authorization':'token '+ acctoken,
                    'User-Agent':'mycone'
                }
            }
            var output ;
            request(option,(err,response,body)=>{
                output=body;
                console.log(body);
                return res.send(output);
            })
        })
})

app.listen(port,(err)=>{
    if(err) throw err;

    console.log(`Server is running on ${port}`);
})