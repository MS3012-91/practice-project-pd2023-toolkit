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


  const { get } = bindActionCreators({ get: getTransactions }, dispatch);

  const [transactionsOnPageCount, setTransactionsOnPageCount] = useState(() => {
    const storedValue = localStorage.getItem('transactionsOnPageCount');
    console.log('storedValue1', storedValue);
    return storedValue ? JSON.parse(storedValue) : '2';
  });

  // const [transactionPage, setTransactionPage] = useState(() => {
  //   const storedValue = localStorage.getItem('transactionPage');
  //   console.log('storedValue2', storedValue);
  //   //return storedValue ? JSON.parse(storedValue) : '1';
  // });

  console.log('transactionsOnPageCount', transactionsOnPageCount);

  useEffect(() => {
    // Dispatch the initial API request when the component mounts
    localStorage.setItem(
      'transactionsOnPageCount',
      JSON.stringify(transactionsOnPageCount)
    );

   // localStorage.setItem('transactionPage', JSON.stringify(transactionPage));
    dispatch(
      getTransactions({
        requestData:  transactionsOnPageCount
      })
    );
  }, [dispatch, transactionsOnPageCount]);

  useSelector((state) => state.transactionsOnPageCount);
  // useSelector((state) => state.transactionPage);

  const handleCountChange = (e) => {
    setTransactionsOnPageCount(e.target.value);
    dispatch(
      getTransactions({
        requestData: e.target.value || transactionsOnPageCount,
      })
    );
  };

  // const handlePageChange = (e) => {
  //   setTransactionPage(e.target.value);
  //   //localStorage.setItem('transactionsPage', JSON.stringify(e.target.value));
  //   dispatch(getTransactions({ requestData: { page: e.target.value } }));
  // };

  const pages = Array.from({ length: countPages}, (_, index) => index + 1);

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
            <button type="button" >
              {page}{' '}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TransactionsCountFilter;
