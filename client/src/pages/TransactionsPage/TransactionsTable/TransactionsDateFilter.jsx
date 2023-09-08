import { React, useState } from 'react';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import styles from './TransactionsTable.module.sass';

function TransactionsDateFilter(props) {
  const dispatch = useDispatch();
  let { transactions } = useSelector(
    ({ transactionsList }) => transactionsList
  );

  const [isListVisible, setIsListVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);

  const dates = transactions.map((t) =>
    format(new Date(t.createdAt), 'dd MMM yyyy')
  );

  const uniqueDate = [...new Set(dates)];

  if (selectedDate) {
    transactions = transactions.filter(
      (t) => format(new Date(t.createdAt), 'dd MMM yyyy') === selectedDate
    );
  }
  return (
    <div>
      <div className={styles.filter}>
        <div onClick={() => setIsListVisible(!isListVisible)}>Select Date</div>
        {isListVisible && (
          <ul className={styles.dateList}>
            {uniqueDate.map((d) => (
              <li
                key={d}
                onClick={() => props.handleSelectDate(d)}
                className={d === selectedDate ? styles.selectedDate : ''}
              >
                {d}
              </li>
            ))}
          </ul>
        )}
        <div onClick={() => setSelectedDate(null)}>Select All</div>
      </div>
    </div>
  );
}

export default TransactionsDateFilter;
