// const ENDPOINT = 'https://api.noroff.dev/api/v1/rainy-days'
// const ENDPOINT = 'http://rainy-days-jackets.local/wp-json/wc/store/products'
const ENDPOINT =
  'https://itinsiderafrica.com/rainydaysjackets/wp-json/wc/store/products'
/**
 * Fetch all products from the endpoint
 * If an id is provided, only fetch the single product details
 * @param {*} id
 */
async function fetchProduct(id) {
  try {
    const response = await fetch(`${ENDPOINT}/${id}`)
    const product = await response.json()
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return error // Or perhaps return an error object with details
  }
}

async function fetchAllProducts() {
  try {
    const response = await fetch(`${ENDPOINT}/`)
    const products = await response.json()
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return [] // Or perhaps return an error object with details
  }
}

async function get(id = null) {
  return id !== null ? await fetchProduct(id) : await fetchAllProducts()
}
