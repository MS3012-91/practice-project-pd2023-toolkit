import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TransactionsTable from './TransactionsTable/TransactionsTable.jsx';
import TransactionsDateFilter from './TransactionsTable/TransactionsDateFilter';
import styles from './TransactionsPage.module.sass';
import TransactionsCountFilter from './TransactionsTable/TransactionsCountFilter';

function TransactionsPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.transactionsPage}>
      <Header />
      <TransactionsCountFilter />
      <div className={styles.transactionsPageBody}>
        <TransactionsDateFilter
          handleSelectDate={handleSelectDate}
          selectedDate={selectedDate}
        />
        <TransactionsTable selectedDate={selectedDate} />
      </div>
      <Footer />
    </div>
  );
}

export default TransactionsPage;
