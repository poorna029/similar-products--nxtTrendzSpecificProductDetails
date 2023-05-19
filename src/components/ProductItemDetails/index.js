import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import ProductCard from '../ProductCard'

import './index.css'

class ProductItemDetails extends Component {
  state = {item: '', qty: 1, apiStatus: 'initial'}

  componentDidMount() {
    this.fetch()
  }

  reduce = () => {
    const {qty} = this.state
    if (qty > 1) {
      this.setState(p => ({qty: p.qty - 1}))
    }
  }

  increase = () => {
    this.setState(p => ({qty: p.qty + 1}))
  }
  //   returnSimilarItems = async () => {
  //     const {match} = this.props
  //     const {params} = match
  //     const {id} = params
  //     // console.log(match, id, params)
  //     const url = `https://apis.ccbp.in/products/${id}`
  //     const jwt = Cookies.get('jwt_token')
  //     const options = {
  //       method: 'GET',
  //       headers: {Authorization: `Bearer ${jwt}`},
  //     }
  //     let data
  //     try {
  //       const res = await fetch(url, options)
  //       data = await res.json()
  //     } catch (e) {
  //       console.log(e)
  //     }

  //     return data
  //   }

  //   renderSimilarItems = () => {
  //     const {match} = this.props

  //     console.log(this.returnSimilarItems())

  //     // const {params} = match
  //     // const {id} = params
  //     // // console.log(match, id, params)
  //     // const url = `https://apis.ccbp.in/products/${id}`
  //     // const jwt = Cookies.get('jwt_token')
  //     // const options = {
  //     //   method: 'GET',
  //     //   headers: {Authorization: `Bearer ${jwt}`},
  //     // }

  //     // const res = await fetch(url, options)
  //     // const data = await res.json()
  //     // console.log('poorna', data)

  //     // console.log('druvitha')

  //     return (
  //       <div>
  //         {/* {similar.map(e => (
  //           <ProductCard productData={e} key={e.id} />
  //         ))} */}
  //         l
  //       </div>
  //     )
  //   }

  renderFailureView = () => (
    <li className="fail-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="fail-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/product">
        <button type="button">Contiue Shopping</button>
      </Link>
    </li>
  )

  renderProductDetails = () => {
    const {item, qty} = this.state
    const {
      imageUrl,
      style,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
      title,
    } = item
    console.log(style)

    return (
      <>
        <li className="poorna-chandra">
          <div className="image-pid">
            <img src={imageUrl} alt="" className="pid-product-item-image" />
          </div>
          <div className="product-item-des-col">
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div className="pid-rating-container">
              <p className="rating">{rating}</p>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Availability :{availability}</p>
            <p>Brand :{brand}</p>
            <hr className="hr" />
            <div className="qty-container">
              <button className="b" onClick={this.reduce} data-testid="minus">
                <BsDashSquare />
              </button>
              <p>{qty}</p>
              <button className="b" onClick={this.increase} data-testid="plus">
                <BsPlusSquare />
              </button>
            </div>
            <button className="cart-button">Add to Cart</button>
          </div>
        </li>

        <div className="similar-products">
          <h1 className="sh">Similar Products</h1>

          <ul className="mobile">
            {item.similarProducts !== undefined
              ? item.similarProducts.map(e => (
                  <li className="pid-product-item" key={e.id}>
                    <img
                      src={e.imageUrl}
                      alt="similar product"
                      className="pid-thumbnail"
                    />
                    <p className="title">{e.title}</p>
                    <p className="brand">by {e.brand}</p>
                    <div className="product-details">
                      <p className="price">Rs {e.price}/-</p>
                      <div className="rating-container">
                        <p className="rating">{e.rating}</p>
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                          alt="star"
                          className="star"
                        />
                      </div>
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </>
    )
  }

  fetch = async () => {
    const {match} = this.props

    const {params} = match
    const {id} = params
    // console.log(match, id, params)
    const url = `https://apis.ccbp.in/products/${id}`
    const jwt = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwt}`},
    }

    const res = await fetch(url, options)
    const data = await res.json()
    // console.log(data)

    if (res.ok === true) {
      const {
        description,
        rating,
        price,
        brand,
        availability,
        title,
        style,
      } = data
      const modSimiliarProducts = data.similar_products.map(e => ({
        title: e.title,
        brand: e.brand,
        imageUrl: e.image_url,
        rating: e.rating,
        price: e.price,
        id: e.id,
      }))

      const givenData = {
        similarProducts: modSimiliarProducts,
        imageUrl: data.image_url,
        totalReviews: data.total_reviews,
      }
      const modifiedData = {
        description,
        rating,
        price,
        brand,
        availability,
        ...givenData,
        title,
        style,
      }

      this.setState({
        item: modifiedData,
        similar: data.similar_products,
        pidStatus: 'success',
      })
    } else if (res.status_code === '404' || res.status_code === 404) {
      this.setState({pidStatus: 'fail'})
    }
  }

  render() {
    // const {modifiedData} = this.state
    // const {
    //   description,
    //   imageUrl,
    //   rating,
    //   price,
    //   brand,
    //   availability,
    //   similarProducts,
    // } = modifiedData

    return this.renderProductDetails()
  }
}

export default ProductItemDetails
