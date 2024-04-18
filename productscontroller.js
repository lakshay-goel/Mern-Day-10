const fsPromises=require("fs/promises")
const getAllProducts=async(req, res)=>{
    // const data = fs.readFileSync('./data.json', "utf8");
    const data = await fsPromises.readFile('./data.json', "utf8");
    const arr = JSON.parse(data);
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
}

const AddProduct = async (req, res) => {
    if(!req.body.title || !req.body.price) {
        return res.status(400).send({
            status: "Error",
            message: "Please provide name and price"
        })
    }
    console.log(req.body);
    const data = req.body;
    // data.id = data.products.length + 1;
    const db = await fsPromises.readFile("./data.json", "utf8");
    const len = JSON.parse(db).length;
    data.id = len + 1;
    const newProduct = JSON.parse(db);
    newProduct.push(data);
    await fsPromises.writeFile("./data.json", JSON.stringify(newProduct));
    res.send({
        status: "Success",
        data: {
            product: data
        }
    })
}

module.exports ={
    getAllProducts, AddProduct
,}

