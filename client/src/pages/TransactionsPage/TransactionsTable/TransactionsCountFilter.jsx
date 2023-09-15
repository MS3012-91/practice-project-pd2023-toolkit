import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import {
  getTransactions,
  setTransactionsOnPageCount,
} from '../../../store/slices/transactionsSlice';

function TransactionsCountFilter() {
  const dispatch = useDispatch();

  let {
    transactionsList: { countPages },
  } = useSelector(({ transactionsList }) => ({
    transactionsList,
  }));

  const [transactionsOnPageCount, setTransactionsOnPageCount] = useState(() => {
    const storedValue = localStorage.getItem('transactionsOnPageCount');
    console.log('storedValue1', storedValue);
    return storedValue ? storedValue : 2;
  });

  const [transactionPage, setTransactionPage] = useState(() => {
    const storedValue = localStorage.getItem('transactionPage');
    console.log('storedValue2', storedValue);
    return storedValue ? storedValue : 1;
  });

  console.log('transactionPage', transactionPage);
  console.log('transactionsOnPageCount', transactionsOnPageCount);

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

  const handleCountChange = (e) => {
    setTransactionsOnPageCount(e.target.value);
    localStorage.setItem('transactionsOnPageCount', e.target.value || 2);
  };

  const handlePageChange = (e) => {
    setTransactionPage(e.target.value);
    console.log('e.target.value', e.target.value);
    localStorage.setItem('transactionPage', e.target.value || 1);
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
        {pages.map((page) => (
          <li key={page}>
            <button type="button" onClick={handlePageChange} value={page}>
              {page}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TransactionsCountFilter;
