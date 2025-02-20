'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles/Home.module.css';
import api from './utils/api';

type Book = {
  id: number;
  title: string;
  author: string;
  publicationYear: number;
};

type Page<T> = {
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
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchBooks = (query: string | null) => {
    const url = query
      ? `/books?page=${currentPage}&size=10&sort=title,asc&query=${query}`
      : `/books?page=${currentPage}&size=10&sort=title,asc`;

    api.get<Page<Book>>(url)
      .then(response => {
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalBooks(response.data.totalElements);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  };

  useEffect(() => {
    if (initialLoad) {
      fetchBooks(null);
      setInitialLoad(false);
    } else {
      handleSearch();
    }
  }, [currentPage]);

  const handleSearch = () => {
    fetchBooks(searchTerm || null);
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  useEffect(() => {
    if (!initialLoad) {
      handleSearch();
    }
  }, [searchTerm]);

  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <h3 className={styles.title}>Books List</h3>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder="Search by title or author"
                className={styles['search-input']}
            />

            <div className={styles['table-container']}>
                <table className={styles['books-table']}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publication Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book=>(
                            <tr key={book.id}>
                                <td>
                                <Link href={`/books/${book.id}`} className={styles['book-link']}>
                                    {book.title}
                                </Link>
                                </td>
                                <td>{book.author}</td>
                                <td>{book.publicationYear}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className={styles.pagination}>
                <span>Current Page: {totalPages === currentPage ?
                                                      currentPage : 
                                                      currentPage + 1} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0 || totalPages === 0}
                    className={styles['pagination-button']}
                >
                First
                </button>
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0 || totalPages === 0}
                    className={styles['pagination-button']}
                >
                Previous
                </button>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage + 1 === totalPages || totalPages === 0}
                    className={styles['pagination-button']}
                >
                Next
                </button>
                <button
                    onClick={() => setCurrentPage(totalPages - 1)}
                    disabled={currentPage + 1 === totalPages || totalPages === 0}
                    className={styles['pagination-button']}
                >
                Last
                </button>
                <span>Total Books: {totalBooks}</span>
            </div>
        </div>
    </div>
  );
}
