import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; 
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TransactionsTable from './TransactionsTable/TransactionsTable.jsx';
import TransactionsDateFilter from './TransactionsTable/TransactionsDateFilter';
import styles from './TransactionsPage.module.sass';

function TransactionsPage() {
// const selectedDate = useSelector((state) => state.transactionTable.selectedDate);
  const [selectedDate, setSelectedDate] = useState(null);
 const handleSelectDate = (date) => {
   setSelectedDate(date);
 };  
  return (
    <div className={styles.transactionsPage}>
      <Header />
      <TransactionsDateFilter handleSelectDate = {handleSelectDate} />
      <TransactionsTable selectedDate={selectedDate} />
      <Footer />
    </div>
  );
}

export default TransactionsPage;
