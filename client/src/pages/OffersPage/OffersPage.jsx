import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {connect} from 'react-redux';
import { getOffers } from '../../store/slices/offersSlice';
import SpinnerLoader from '../../components/Spinner/Spinner';

function OffersPage({ isFetching, error, offers, getOffers }) {
    useEffect (()=> {getOffers()}, [])
  return (
      <div>
          <Header />
          <div>
              {isFetching && <SpinnerLoader />}
              {error && <div> ERROR </div>}
              {!isFetching && !error && <div>{ JSON.stringify (offers)}</div>}
          </div>
          <Footer />
    </div>
  )
}

const mapStateToPros = state => state.offersList;
const mapDispatchToProps = dispatch => ({
    getOffers: () => dispatch(getOffers()),
})
export default connect(mapStateToPros, mapDispatchToProps) (OffersPage);