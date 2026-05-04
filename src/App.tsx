import { useState } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json'
import './e-commerce-stylesheet.css'

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type BasketItem = {
  id: number
  name: string
  price: number
  quantity: number
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortOption, setSortOption] = useState<string>('AtoZ')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [basket, setBasket] = useState<BasketItem[]>([])

  function showBasket() {
    const areaObject = document.getElementById('shopping-area')
    if (areaObject !== null) {
      areaObject.style.display = 'block'
    }
  }

  function hideBasket() {
    const areaObject = document.getElementById('shopping-area')
    if (areaObject !== null) {
      areaObject.style.display = 'none'
    }
  }

  const searchedProducts: Product[] = [...itemList]
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => !inStockOnly || product.quantity > 0)
    .sort((a, b) => {
      switch (sortOption) {
        case 'AtoZ':
          return a.name.localeCompare(b.name)
        case 'ZtoA':
          return b.name.localeCompare(a.name)
        case '£LtoH':
          return a.price - b.price
        case '£HtoL':
          return b.price - a.price
        case '*LtoH':
          return a.rating - b.rating
        case '*HtoL':
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  function getResultsText() {
    const count = searchedProducts.length
    const hasSearch = searchTerm.trim() !== ''

    if (hasSearch) {
      if (count === 0) return 'No search results found'
      if (count === 1) return '1 Result'
      return `${count} Results`
    }

    if (count === 1) return '1 Product'
    return `${count} Products`
  }

  function addToBasket(product: Product) {
    setBasket((currentBasket) => {
      const existingItem = currentBasket.find((item) => item.id === product.id)

      if (existingItem) {
        return currentBasket.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...currentBasket,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }
      ]
    })
  }

  function removeFromBasket(productId: number) {
    setBasket((currentBasket) => {
      return currentBasket
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    })
  }

  const totalCost = basket.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/Assets/Logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img
            id="shopping-icon"
            onClick={showBasket}
            src="./src/Assets/shopping-basket.png"
          ></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>

          {basket.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {basket.map((item) => (
                <div key={item.id} className="shopping-row">
                  <div className="shopping-information">
                    <p>
                      {item.name} (£{item.price.toFixed(2)}) - {item.quantity}
                    </p>
                  </div>
                  <button
                    className="shopping-remove"
                    onClick={() => removeFromBasket(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <p>Total: £{totalCost.toFixed(2)}</p>
            </>
          )}
        </div>
      </div>

      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(changeEventObject) => setSearchTerm(changeEventObject.target.value)}
        ></input>

        <div id="control-area">
          <select
            value={sortOption}
            onChange={(changeEventObject) => setSortOption(changeEventObject.target.value)}
          >
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>

          <input
            id="inStock"
            type="checkbox"
            checked={inStockOnly}
            onChange={(changeEventObject) => setInStockOnly(changeEventObject.target.checked)}
          ></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>

      <p id="results-indicator">{getResultsText()}</p>

      <ProductList
        itemList={searchedProducts}
        onAddToBasket={addToBasket}
      />
    </div>
  )
}

export default App
