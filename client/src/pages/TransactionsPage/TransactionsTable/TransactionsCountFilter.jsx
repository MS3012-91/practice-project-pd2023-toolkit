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
  } = useSelector(({ transactionsList}) => ({
    transactionsList,
  }));
  const { get } = bindActionCreators({ get: getTransactions }, dispatch);

 
  const [transactionsOnPageCount, setTransactionsOnPageCount] = useState(2);

  //  dispatch(
  //  getTransactions({
  //    requestData: transactionsOnPageCount,
  //  })
  // );
  
   useEffect(() => {
     // Dispatch the initial API request when the component mounts
     dispatch(getTransactions({ requestData: transactionsOnPageCount }));
   }, [dispatch, transactionsOnPageCount]);
 

  const handleCountChange = (e) => {
    const newTransactionsOnPageCount = parseInt(e.target.value, 10);
    setTransactionsOnPageCount(newTransactionsOnPageCount);
    dispatch(getTransactions({ requestData: newTransactionsOnPageCount }));
  };

  const pages = Array.from({ length: countPages }, (_, index) => index + 1);
  console.log('pages', pages)

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
      {for (let i=0; i<countPages; i++) {
      <li key = {i}> <button type = 'button'>{i} </button></li>
  }}</ul>
    </>
  );
}


export default TransactionsCountFilter;
