type ContentAreaProps = {
	itemList: Product[]
	onAddToBasket: (product: Product) => void
  }
  
  type Product = {
	id: number
	name: string
	price: number
	category: string
	quantity: number
	rating: number
	image_link: string
  }
  
  export const ProductList = (props: ContentAreaProps) => {
	return (
	  <div id="productList">
		{props.itemList.map((item) => {
		  const imagePath = new URL(`../Assets/Product_Images/${item.image_link}`, import.meta.url).href
  
		  return (
			<div key={item.id} className="product">
			  <div className="product-top-bar">
				<h2>{item.name}</h2>
				<p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
			  </div>
			  <img src={imagePath}></img>
			  <button
				value={item.id}
				disabled={item.quantity === 0}
				onClick={() => props.onAddToBasket(item)}
			  >
				{item.quantity === 0 ? 'Out of stock' : 'Add to basket'}
			  </button>
			</div>
		  )
		})}
	  </div>
	)
  }
  