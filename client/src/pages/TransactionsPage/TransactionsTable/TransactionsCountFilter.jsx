import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTransactions,
} from '../../../store/slices/transactionsSlice';
import styles from './TransactionsCountFilter.module.sass';

function TransactionsCountFilter() {
  const dispatch = useDispatch();

  let {
    transactionsList: { countPages },
  } = useSelector(({ transactionsList }) => ({
    transactionsList,
  }));

  const [transactionsOnPageCount, setTransactionsOnPageCount] = useState(() => {
    const storedValue = localStorage.getItem('transactionsOnPageCount');
    return storedValue ? storedValue : 2;
  });

  const [transactionPage, setTransactionPage] = useState(() => {
    const storedValue = localStorage.getItem('transactionPage');
    return storedValue ? storedValue : 1;
  });

  useEffect(() => {
    dispatch(
      getTransactions({
        limit: transactionsOnPageCount,
        page: transactionPage,
      })
    );
  }, [dispatch, transactionsOnPageCount, transactionPage]);

  useSelector((state) => state.transactionsOnPageCount);
  useSelector((state) => state.transactionPage);
  console.log('transactionPage', transactionPage);

  const handleCountChange = (e) => {
    const currentCount = Number(e.target.value);
    setTransactionsOnPageCount(currentCount);
    setTransactionPage(1);
    localStorage.setItem('transactionsOnPageCount', currentCount || 2);
    localStorage.setItem('transactionPage', 1);
  };

  const handlePageChange = (e) => {
    const newPage = Number(e.target.value);
    setTransactionPage(newPage);
    localStorage.setItem('transactionPage', newPage || 1);
  };

  const handlePageNextPage = () => {
    const nextPage = Number(localStorage.getItem('transactionPage')) + 1;
    setTransactionPage(nextPage);
    localStorage.setItem('transactionPage', nextPage);
  };

    const handlePagePrevPage = () => {
      const prevPage = Number(localStorage.getItem('transactionPage')) - 1;
      setTransactionPage(prevPage);
      console.log('prevPage', prevPage);
      localStorage.setItem('transactionPage', prevPage);
    };

  const pages = Array.from({ length: countPages }, (_, index) => index + 1);

  return (
    <>
      <form>
        <label htmlFor="transactions"> Transactions count:</label>
        <select
          id="transactions"
          name="transactions"
          value={transactionsOnPageCount}
          onChange={handleCountChange}
        >
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </form>
      <ul>
        {countPages > 1 && (
          <li>
            <button
              type="button"
              onClick={handlePagePrevPage}
              disabled={transactionPage <= 1}
            >
              &laquo;
            </button>
          </li>
        )}
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              onClick={handlePageChange}
              value={page}
              className={page === transactionPage ? styles.active : ''}
            >
              {page}
            </button>
          </li>
        ))}
        {countPages > 1 && (
          <li>
            <button
              type="button"
              onClick={handlePageNextPage}
              disabled={transactionPage >= countPages}
            >
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </>
  );
}

export default TransactionsCountFilter;
