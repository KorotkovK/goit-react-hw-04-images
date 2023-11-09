import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showLoadMore, setShowLoadMore] = useState(false);

  const fetchImages = useCallback(() => {
    setIsLoading(true);

    const apiKey = '39292315-4a49a35cd99dea9ef99c54ebb';

    axios
      .get(
        `https://pixabay.com/api/?q=${query}&page=${page}&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=12`
      )
      .then((response) => {
        if (response.data.hits.length > 0) {
          setImages((prevImages) => [...prevImages, ...response.data.hits]);
          setIsLoading(false);
          setShowLoadMore(true);
        } else {
          setIsLoading(false);
          setShowLoadMore(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
        setIsLoading(false);
      });
  }, [query, page]);

  useEffect(() => {
    if (query.trim() === '') {
      return;
    }

    fetchImages();
  }, [query, fetchImages]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setShowLoadMore(false);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleOpenModal = (image) => {
    setShowModal(true);
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearch} />
      {query && <ImageGallery images={images} onImageClick={handleOpenModal} />}
      {isLoading && <Loader type="Puff" color="#00BFFF" height={100} width={100} />}
      {showLoadMore && images.length > 0 && !isLoading && (
        <Button onClick={handleLoadMore}>Load More</Button>
      )}
      {showModal && <Modal src={selectedImage} alt="Selected Image" onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
