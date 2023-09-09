import { React, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions, setTransactionsOnPageCount } from '../../../store/slices/transactionsSlice';
import { bindActionCreators } from '@reduxjs/toolkit';

console.log('setTransactionsOnPageCount', {setTransactionsOnPageCount});

function TransactionsCountFilter() {
  const dispatch = useDispatch();
  let { transactions } = useSelector(
    ({ transactionsList }) => transactionsList
    );
    

  const [transactionsOnPageCount, setTransactionsOnPageCount] = useState(2);

  // const { get } = bindActionCreators(
  //   { get: getTransactions(transactionsOnPageCount) },
  //   dispatch
  // );

  useEffect(() => {
    dispatch(getTransactions(transactionsOnPageCount));
  }, [dispatch, transactionsOnPageCount]);

  const handleCountChange = (e) => {
    const newTransactionsOnPageCount = parseInt(e.target.value, 10);
    setTransactionsOnPageCount(newTransactionsOnPageCount);
    dispatch(setTransactionsOnPageCount(newTransactionsOnPageCount));
  };
  const transactionsCount = transactions.length;
  const paginationPagesCount = Math.ceil(
    transactionsCount / transactionsOnPageCount
  );

  console.log('paginationPagesCount', paginationPagesCount);

  return (
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
  );
}

export default TransactionsCountFilter;
