"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../utils/api';
import styles from '../../styles/BookDetails.module.css';

const BookDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = () =>{
    api.get(`/books/${id}`)
        .then(response => setBook(response.data))
        .catch(error => console.error('Error fetching book:', error));
  }

  const getAiInsights = () => {
    setLoading(true);
    api.get(`/books/${id}/ai-insights`)
      .then(response => {
        
        setLoading(false);
        fetchBookDetails();
      })
      .catch(error => {
        console.error('Error fetching AI insights:', error);
        setLoading(false);
      });
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>{book.title}</h1>
      <br/>
      <p>Author: {book.author}</p>
      <p>Year: {book.publicationYear}</p>
      <br/><br/>
      {book.description && <p>Description: {book.description}</p>}
      <br/><br/>
      <button onClick={getAiInsights} className={styles['ai-button']}>
        {loading ? 'Loading AI Insights...' : 'Get AI Insights'}
      </button>
      <br/>
      <button onClick={()=> router.push('/')} className={styles['return-button']}>
        Back to Book List
      </button>
    </div>
  );
};

export default BookDetails;