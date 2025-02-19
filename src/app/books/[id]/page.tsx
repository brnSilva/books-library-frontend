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
      <div className={styles.content}>
        <h1 className={styles.title}>{book.title}</h1>
        <table className={styles['books-table']}>
          <td className={styles['books-table-left']}>
            <tr>Author:</tr>
            <tr>Publication Year:</tr>
            <tr>ISBN:</tr>
          </td>
          <td className={styles['books-table-right']}>
            <tr>{book.author}</tr>
            <tr>{book.publicationYear}</tr>
            <tr>{book.isbn}</tr>
          </td>
        </table>

        <button onClick={getAiInsights} className={styles['ai-button']}>
          {loading ? 'Hang Tight! AI is working its magic...' : 'Explore the Book'}
        </button>

        <div className={styles['description-container']}>
          { book.description && <p className={styles.description}>{book.description}</p>}
        </div>
        
        <div className={styles['button-container']}>
          <button onClick={()=> router.push('/')} className={styles['return-button']}>
            Back to Book List
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default BookDetails;