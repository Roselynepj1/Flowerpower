const getPopularProducts = async () => {
  const popularProductsContainer = document.getElementById('popular-products')
  const popularProductsSkeletons = document.getElementById(
    'popular-products-skeletons'
  )
  if (!popularProductsContainer) return
  try {
    // Fetch all products
    const products = await get()
    // Hide skeletons
    popularProductsSkeletons.style.display = 'none'

    // Get only four popular products
    const popularProducts = products.slice(0, 6)

    // Render popular products
    popularProducts.forEach((product) => {
      const productElement = singleProduct(product)
      popularProductsContainer.appendChild(productElement)
    })
  } catch (error) {
    console.error('Error fetching or rendering products:', error)
    // Handle error appropriately
    popularProductsSkeletons.style.display = 'none'
    popularProductsContainer.append(noProductsFound())
  }
}
/**
 *Sorts products deepending on their sort order
 *Generates a new array of products after sorting
 * @param {*} sortOrder
 * @param {*} filteredProducts
 * @return {*} sortedProducts
 */
function handleSorting(sortOrder, filteredProducts) {
  switch (sortOrder) {
    case 'average_rating':
      return filteredProducts.sort(
        (a, b) => parseFloat(a.average_rating) - parseFloat(b.average_rating)
      )

    case 'lowhigh':
      return filteredProducts.sort(
        (a, b) => parseFloat(a.prices.price) - parseFloat(b.prices.price)
      )

    case 'highlow':
      return filteredProducts.sort(
        (a, b) => parseFloat(b.prices.price) - parseFloat(a.prices.price)
      )
    default:
      return filteredProducts
  }
}

const getAllProducts = async () => {
  const allProductsContainer = document.getElementById('allProducts')
  const allProductsSkeletons = document.getElementById('allProductsSkeletons')
  const filterOptions = document.getElementById('filterOptions')
  const priceToElement = document.getElementById('price_to')
  const priceFromElement = document.getElementById('price_from')
  const inStockElement = document.getElementById('in_stock')
  const onSaleElement = document.getElementById('on_sale')
  const searchElement = document.getElementById('search')
  const sortElement = document.getElementById('sort')
  if (!allProductsContainer) return

  try {
    // Fetch all products
    const products = await get()

    // Hide skeletons
    allProductsSkeletons.style.display = 'none'

    // Retrieve query parameters
    const searchParams = new URLSearchParams(window.location.search)
    const priceTo = searchParams.get('price_to')
    const priceFrom = searchParams.get('price_from')
    const inStock = searchParams.get('in_stock')
    const onSale = searchParams.get('on_sale')
    const sortBy = searchParams.get('sort_by')

    const search = searchParams.get('search')

    let filteredProducts = products

    // Filter products by price
    if (priceFrom) {
      priceFromElement.value = priceFrom
      filteredProducts = products.filter((product) => {
        return formatPrice(product.prices.price, product.prices) >= priceFrom
      })
    }

    if (priceTo) {
      priceToElement.value = priceTo
      filteredProducts = filteredProducts.filter((product) => {
        return formatPrice(product.prices.price, product.prices) <= priceTo
      })
    }

    if (inStock) {
      inStockElement.value = inStock
      filteredProducts = filteredProducts.filter((product) => {
        return product['is_in_stock'].toString() === inStock
      })
    }
    if (onSale) {
      onSaleElement.value = onSale
      filteredProducts = filteredProducts.filter((product) => { 
        return product['on_sale'].toString() === onSale
      })
    }

    //filter by search word
    if (search) {
      searchElement.value = search
      filteredProducts = filteredProducts.filter((product) =>
        searchLikeSQL(search, product.name)
      )
    }

    if (sortBy) {
      sortElement.value = sortBy
      filteredProducts = handleSorting(sortBy, filteredProducts)
    }

    // Render products
    if (filteredProducts.length === 0) {
      return allProductsContainer.append(noProductsFound())
    }

    // if (screenWidth > 577) {
    // }
    filterOptions.style.display = 'block'
    filteredProducts.forEach((product) => {
      const productElement = singleProduct(product)
      allProductsContainer.appendChild(productElement)
    })
  } catch (error) {
    console.error('Error fetching or rendering products:', error)
    // Handle error appropriately
    allProductsSkeletons.style.display = 'none'
    allProductsContainer.append(noProductsFound())
  }
}

const showSlideShow = async () => {
  const popularProductsContainer = document.getElementById('productSlide')
  const popularProductsSkeletons = document.getElementById(
    'productImageSlideShow'
  )
  if (!popularProductsContainer) return
  try {
    // Fetch all products
    const products = await get()
    // Hide skeletons
    popularProductsSkeletons.style.display = 'none'

    // Get only four slide products
    const slideProducts = products.reverse().slice(0, 3)

    // Render slide products
    slideProducts.forEach((product) => {
      const productElement = slideShowProductImage(product)
      popularProductsContainer.appendChild(productElement)
    })
  } catch (error) {
    console.error('Error fetching or rendering products:', error)
    // Handle error appropriately
    popularProductsSkeletons.style.display = 'none'
    popularProductsContainer.append(noProductsFound())
  }
}

const renderCheckOutProducts = async () => {
  //get rendering area
  const checkOutContainer = document.getElementById('checkOutItems')
  //get ckeckout skeletons
  const checkOutSkeletons = document.getElementById('checkoutSkeletons')
  //if checout container is not found, exit
  if (!checkOutContainer) return

  try {
    // Fetch all products
    const products = await get()
    checkOutSkeletons.style.display = 'none'
    //fetch checkout items
    const checkOutProducts = getCheckOutItems()

    if (!checkOutProducts.length)
      return checkOutContainer.appendChild(showNoCheckOutProducts())

    //update the checkout total
    updateCheckoutTotal()

    //iterate all checkout products and filter them out from the list of all products

    checkOutProducts.forEach((checkoutProduct) => {
      const found = products.find(
        (product) => product.id === checkoutProduct['id']
      )

      if (found) {
        checkOutContainer.appendChild(
          createCheckoutElement(found, checkoutProduct['total'])
        )
      }
    })
  } catch (error) {
    checkOutContainer.appendChild(showNoCheckOutProducts())
  }
}
documentReady(function () {
  //update cart
  updateCartBadge()
  getPopularProducts()
  getAllProducts()
  showSlideShow()
  renderCheckOutProducts()

  //the sort element
  const sortElement = document.getElementById('sort')
  if (sortElement) {
    sortElement.addEventListener('change', function () {
      const currentURL = new URL(window.location.href)
      const params = new URLSearchParams(currentURL.search)
      params.set('sort_by', this.value)
      currentURL.search = params.toString()
      window.location.href = currentURL.href
    })
  }
  // the filter form
  const showFilter = document.getElementById('showFilter')
  if (showFilter) {
    showFilter.onclick = function () {
      if (this.classList.contains('fa-bars')) {
        this.classList = 'fa fa-times'
        document.getElementById('filterForm') &&
          (document.getElementById('filterForm').style.display = 'block')
      } else {
        this.classList = 'fa fa-bars'
        document.getElementById('filterForm') &&
          (document.getElementById('filterForm').style.display = 'none')
      }
    }
  }
})
