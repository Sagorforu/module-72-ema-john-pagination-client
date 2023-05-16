import { getShoppingCart } from "../utilities/fakedb";

const cartProductsLoader = async() => {
     // if card data is in database, you have to use async await
     const storedCart = getShoppingCart();
     const ids = Object.keys(storedCart);
     console.log(ids);
    const loadedProducts = await fetch("http://localhost:5000/productsByIds", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(ids)
    });
    const products = await loadedProducts.json();
    console.log('products by id:', products)
   

    const savedCart = [];
    for(const id in storedCart){
        const addedProduct = products.find(pd => pd._id === id);
        if(addedProduct){
            const quantity = storedCart[id];
            addedProduct.quantity = quantity;
            savedCart.push(addedProduct);
        }
    }

    //if you need to send(return) two things you can't return same time to send two things like......... return products, savedCart; you can't
    // but you cant return one things like array object
    // return [products, savedCart]
    // another option
    // return { products, savedCart }

    return savedCart;
}

export default cartProductsLoader;