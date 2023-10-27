const getSingleProduct = async () => {
    const productSkeleton = document.getElementById('productSkeleton')
    const productContainer = document.getElementById('productDescription')
    const id = new URLSearchParams(window.location.search).get('id')
 
    try{
        if(!id) throw Error("No product id found")
        const product = await get(id)
        //remove the skeleton
        productSkeleton.style.display = "none"
        productContainer.append(createProductDescription(product))
    }catch(error){
        console.log(error)
        productSkeleton.style.display = "none"
        productContainer.append(noProductsFound())
    }
}

documentReady( () => {
  getSingleProduct()
})
