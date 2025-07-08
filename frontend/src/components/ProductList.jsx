import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'; 
import ProductCard from './ProductCard.jsx';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'; 

import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination'; 
import 'swiper/css/scrollbar'; 

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) {
          throw new Error(`HTTP hatası! Durum kodu: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err);
        console.error("Ürünler çekilirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Container className="text-center my-5">Ürünler yükleniyor...</Container>;
  }

  if (error) {
    return <Container className="text-center my-5 text-danger">Hata: {error.message}</Container>;
  }

  return (
    <Container  className="my-5">
      <h1 className="text-center mb-4" style={{ fontFamily: 'Avenir Heavy' }}>Ürün Listesi</h1>

      {products.length > 0 ? (
        <Swiper
          modules={[Navigation, Scrollbar, A11y]}
          spaceBetween={30} 
          slidesPerView={1} 
          navigation 
          scrollbar={{ draggable: true }} 
     
          keyboard={{ enabled: true }}
          breakpoints={{
            576: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
        >
          {products.map(product => (
            <SwiperSlide key={product.name}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center">Ürün bulunamadı.</div>
      )}
    </Container>
  );
}

export default ProductList;