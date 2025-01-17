import React from 'react';
import SpinnerLoader from '../../../components/Spinner/Spinner';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import styles from './TransactionsTable.module.sass';
import CONSTANTS from '../../../constants';

function TransactionsTable({ selectedDate }) {
  let {
    transactionsList: {
      isFetching,
      error,
      transactions,
      userName,
      sumOfExpenses,
    },
    userStore: {
      data: { role },
    },
  } = useSelector(({ transactionsList, userStore }) => ({
    transactionsList,
    userStore,
  }));

  if (selectedDate) {
    transactions = transactions.filter(
      (t) => format(new Date(t.createdAt), 'dd MMM yyyy') === selectedDate
    );
  }

  return (
    <div className={styles.tableResults}>
      {error && <div> ERROR</div>}
      {isFetching && <SpinnerLoader />}
      {!isFetching && !error && !transactions.length && (
        <div> No Transactions </div>
      )}
      {!isFetching && !error && transactions.length && (
        <table className={styles.table}>
          <caption> Transactions </caption>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <th key={1}> Amount </th>
              <th key={2}> Operation Type </th>
              <th key={3}> Data </th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td
                  key={1}
                  className={
                    t.operationType === 'EXPENSE' ? styles.exp : styles.inc
                  }
                >
                  {t.operationType === 'EXPENSE' ? -t.amount : t.amount}
                </td>
                <td key={2}>{t.operationType}</td>
                <td key={3}>{format(new Date(t.createdAt), 'dd MMM yyyy')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className={styles.tfoot}>
            <tr>
              <td key={1}>
                {transactions.reduce(
                  (accum, t) =>
                    t.operationType === 'EXPENSE'
                      ? accum - Number(t.amount)
                      : accum + Number(t.amount),
                  0
                )}
              </td>
              <td key={2}>{}</td>
              <td key={3}>{}</td>
            </tr>
          </tfoot>
        </table>
      )}
      {role === CONSTANTS.CUSTOMER && sumOfExpenses > 300 && (
        <div className={styles.congrats}>
          <p>
            {userName}, congratulations, create the next contest within 3 days
            with a 5% discount.
          </p>
        </div>
      )}
    </div>
  );
}
export default TransactionsTable;
