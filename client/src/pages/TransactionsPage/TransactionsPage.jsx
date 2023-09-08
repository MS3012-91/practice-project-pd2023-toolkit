import React from 'react'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TransactionsTable from './TransactionsTable/TransactionsTable';


function TransactionsPage(){
  return (
    <>
      <Header />
      <TransactionsTable/>
      <Footer />
    </>
  );
}

  
export default TransactionsPage;
