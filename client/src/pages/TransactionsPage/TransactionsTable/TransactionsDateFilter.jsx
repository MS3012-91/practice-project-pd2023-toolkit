import { React, useState } from 'react';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import styles from './TransactionsDateFilter.module.sass';

function TransactionsDateFilter({ selectedDate, handleSelectDate }) {
  const dispatch = useDispatch();
  let { transactions } = useSelector(
    ({ transactionsList }) => transactionsList
  );

  console.log('props', {
    selectedDate,
  });
  const [isListVisible, setIsListVisible] = useState(false);

  //const [selectedDate, setSelectedDate] = useState(null);
  const [selectDateActive, setSelectDateActive] = useState(false);
  const [selectAllActive, setSelectAllActive] = useState(false);

  const handleUpdateButtonSelectDate = () => {
    setSelectDateActive(!selectDateActive);
    setSelectAllActive(false);
  };
  const handleUpdateButtonSelectAll = () => {
    setSelectAllActive(!selectAllActive);
    setSelectDateActive(false);
  };

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
    <div className={styles.filter}>
      <button
        handleUpdateButtonSelectDate
        type="button"
        onClick={() => {
          setIsListVisible(!isListVisible);
          handleUpdateButtonSelectDate();
        }}
        className={selectDateActive ? styles.activeFilter : ''}
      >
        Select Date
      </button>
      {isListVisible && (
        <ul className={styles.dateList}>
          {uniqueDate.map((d) => (
              <li
              key={d}
              onClick={() => handleSelectDate(d)}
              className={d === selectedDate ? styles.selectedDate : ''}
            > {d}
            </li>
          ))}
        </ul>
      )}
      <button
        handleUpdateButtonSelectAll
        type="button"
        onClick={() => {
          handleSelectDate(null);
          handleUpdateButtonSelectAll();
        }}
        className={selectAllActive ? styles.activeFilter : ''}
      >
        Select All
      </button>
    </div>
  );
}

export default TransactionsDateFilter;
