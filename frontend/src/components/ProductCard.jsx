import React from 'react';

function ProductCard({product}) {
    return (
        <>
        <div className='card'>
            <h3>Product name : {product.name}</h3>
            <h4>Category : {product.category}</h4>
            <p>Price : {product.price}</p>
        </div>
        </>
    );
}

export default ProductCard;