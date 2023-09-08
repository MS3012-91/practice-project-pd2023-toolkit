import React from 'react'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TransactionsTable from './TransactionsTable/TransactionsTable.jsx';
import styles from './TransactionsPage.module.sass';


function TransactionsPage(){
  return (
    <div className={styles.transactionsPage}>
      <Header />
      <TransactionsTable />
      <Footer />
    </div>
  );
}

  
export default TransactionsPage;
