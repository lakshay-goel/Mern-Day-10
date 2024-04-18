const express = require('express');
const fsPromises = require("fs/promises");
const productsController = require('./controller/productscontroller.js');
const app = express();

app.use(express.json());

app.use((req,res,next)=>{
    const time =new Date().toLocaleString();
    fsPromises.appendFile('./log.txt',req.url+'\t'+time+'\n');
    next();
});

app.route('/api/products');
app.get('/api/products', productsController.getAllProducts);

app.post('/api/products', productsController.AddProduct);
app.put('/api/products', async(req, res)=>{
    // const data = fs.readFileSync('./data.json', "utf8");
    const data = await fsPromises.readFile('./data.json', "utf8");
    const arr = JSON.parse(data).products;
    res.status(200);
    res.json(
        {
            status: 'success',
            results: arr.length,
            data:{
                products: arr
            }
        }
    )
});

app.post('/api/products', async (req, res)=>{
    const data = req.body;
    if(!data.price || !data.title){
        res.json({
            status: 'fail',
            message: 'Title or price must be provided',
        });
    }
    else{
            const db = await fsPromises.readFile("./data.json", "utf8");
            const arr = JSON.parse(db);
            const len = arr.length;
            const newProduct = data;
            if(len==0){
                newProduct.id = 1;
            }
            else{
                newProduct.id = (arr[len-1].id)+1;
            }
            arr.push(newProduct);
            res.status(201);
            fsPromises.writeFile("./data.json", JSON.stringify(arr));
        
            res.json({
                status: 'success',
                results: 1,
                data:{
                    newProduct: newProduct,
                }
            })
    }
});

app.put('/api/products/:id', async (req, res)=>{
    const arr = JSON.parse( await fsPromises.readFile("./data.json", "utf8"));
    const reqId = parseInt(req.params.id);
    const data = req.body;
    data.id = reqId;
    const newArr = arr.map((elem)=>{
        if(elem.id==reqId)return data;
        else return elem;
    });
    res.status(200);
    fsPromises.writeFile("./data.json", JSON.stringify(newArr));
    res.json({
        status: 'success',
        results: 1,
        data:{
            newProduct: data,
        }
    })
});

app.delete('/api/products/:id', async(req, res)=>{
    const reqId = parseInt(req.params.id);
    const arr = JSON.parse( await fsPromises.readFile( "./data.json", "utf8"));
    const newArr = arr.filter((elem)=>{
        if(elem.id === reqId)return false;
        else return true;
    });
    fsPromises.writeFile("./data.json", JSON.stringify(newArr));
    res.status(204);
    res.json({
        status: 'success',
        data: {
            newProduct: null,
        }
    })
});



app.listen(1400);
