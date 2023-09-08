import React, { useEffect } from 'react';
import { getTransactions } from '../../../store/slices/transactionsSlice';
import SpinnerLoader from '../../../components/Spinner/Spinner';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
  bindActionCreators
} from '@reduxjs/toolkit';

function TransactionsTable () {
    const { isFetching, error, transactions } = useSelector(
        ({ transactionsList }) => transactionsList
    );

const dispatch = useDispatch();

const { get } = bindActionCreators({ get: getTransactions }, dispatch);

useEffect(() => {
  get();
}, []);


// function TransactionsTable({isFetching, error, transactions, getTransactions}) {
//   useEffect(() => {
//     getTransactions();
//   }, []);
  return (
      <>
          {error&& <div> ERROR</div>}
          {isFetching && <SpinnerLoader />}
          {!isFetching && !error && !transactions.length && <div> No Transactions </div>}
          {!isFetching && !error && transactions.length && <table>
      <caption> Transactions </caption>
      <thead>
        <tr>
          <th key={1}> Amount </th>
          <th key={2}> Operation Type </th>
          <th key={3}> Data </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td key={1}> {t.amount}</td>
            <td key={2}>{t.operationType}</td>
            <td key={3}>{format (new Date (t.createdAt), 'dd MMM yyyy') }</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td key={1}> {transactions.reduce((accum, t)=> accum+ Number(t.amount),0)}</td>
          <td key={2}>{}</td>
          <td key={3}>{}</td>
        </tr>
      </tfoot>
    </table>}</>
  );
}
// const mapStateToProps = ({ transactionsList }) => transactionsList;
// const mapDispatchToProps = (dispatch) => ({
//   getTransactions: () => dispatch(getTransactions()),
// });

export default TransactionsTable;
