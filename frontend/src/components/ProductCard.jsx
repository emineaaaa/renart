import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faStarHalfAlt as fasStarHalf } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'; 

function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState('yellow'); 

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const convertPopularityToStars = (score) => {
    const starRating = (score * 5); 
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= starRating) {
        stars.push(<FontAwesomeIcon key={i} icon={fasStar} className="text-warning" />); 
      } else if (i - 0.5 === starRating) {
        stars.push(<FontAwesomeIcon key={i} icon={fasStarHalf} className="text-warning" />); 
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={farStar} className="text-secondary" />); 
      }
    }
    return (
      <>
        {stars} <span style={{ fontFamily: 'Montserrat', fontSize: '0.9rem', marginLeft: '5px' }}>{starRating.toFixed(1)}/5</span>
      </>
    );
  };

  const colorOptions = [
    { name: 'yellow', label: 'Yellow Gold', hex: '#E6CA97' },
    { name: 'rose', label: 'Rose Gold', hex: '#E1A4A9' },
    { name: 'white', label: 'White Gold', hex: '#D9D9D9' },
  ];

  return (
    <Card className="h-100 shadow-sm border-0 product-card"> 
      <Card.Img variant="top" src={product.images[selectedColor]} alt={product.name} className="product-image" />
      <Card.Body className="d-flex flex-column p-3"> 
        <Card.Title
          className="text-muted mb-1"
          style={{ fontFamily: 'Avenir Book', fontSize: '1rem' }}
        >
          {product.name}
        </Card.Title>
        <Card.Text
          className="fw-bold mb-2"
          style={{ fontFamily: 'Avenir Book', fontSize: '1.25rem' }}
        >
          ${product.price?.toFixed(2)} USD
        </Card.Text>

        {/* Renk Seçiciler */}
        <div className="d-flex align-items-center mb-2">
          <span className="me-2" style={{ fontFamily: 'Montserrat', fontSize: '0.9rem' }}>Color:</span>
          {colorOptions.map(option => (
            <div
              key={option.name}
              className={`color-dot rounded-circle me-2 ${selectedColor === option.name ? 'selected-color' : ''}`}
              style={{
                backgroundColor: option.hex,
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                border: selectedColor === option.name ? '2px solid #007bff' : '1px solid #ccc'
              }}
              onClick={() => handleColorChange(option.name)}
              title={option.label}
            ></div>
          ))}
        </div>
        <Card.Text className="mt-auto" style={{ fontFamily: 'Montserrat', fontSize: '0.9rem' }}>
            {convertPopularityToStars(product.popularityScore)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
export default ProductCard;