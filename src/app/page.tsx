'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles/Home.module.css';

type Book ={
  id: number;
  title: string;
  author: string;
  publicationYear: number;
};

type Page<T> ={
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        axios.get<Page<Book>>(`http://localhost:8080/books?page=${currentPage}&size=10&sort=title,asc`)
            .then(response =>{
                setBooks(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch(error =>{
                console.error('Error fetching books:', error);
            });
    }, [currentPage]);

    return (
        <div className={styles.container}>
            <h3>Booooooks List</h3>
            <ul className={styles['books-list']}>
                {books.map(book =>(
                    <li key={book.id} className={styles['books-list-item']}>
                        <Link href={`/books/${book.id}`} className={styles['book-link']}>
                            {book.title} by {book.author} ({book.publicationYear})
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.pagination}>
                <button onClick={() => setCurrentPage(currentPage-1)}
                        disabled={currentPage === 0}
                        className={styles['pagination-button']}>
                    Previous
                </button>
                <button onClick={() => setCurrentPage(currentPage+1)}
                        disabled={currentPage + 1 === totalPages}
                        className={styles['pagination-button']}>
                    Next
                </button>
            </div>
        </div>
    );
}