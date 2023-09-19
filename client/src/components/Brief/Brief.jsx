import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  updateContest,
  clearContestUpdationStore,
} from '../../store/slices/contestUpdationSlice';
import { changeEditContest } from '../../store/slices/contestByIdSlice';
import ContestForm from '../ContestForm/ContestForm';
import styles from './Brief.module.sass';
import ContestInfo from '../Contest/ContestInfo/ContestInfo';
import Error from '../Error/Error';

const Brief = (props) => {
  console.log('props', props);
  const setNewContestData = (values) => {
    const data = new FormData();
    Object.keys(values).forEach((key) => {      
      if (key !== 'file' && values[key]) data.append(key, values[key]);
      if (key === 'file') {
        data.append('file', values.file);
        console.log('values.file', values.file); //корректно
      }
    });
    data.append('contestId', props.contestData.id);
    console.log('Data to be sent:', data); //формдата
    props.contestData.update(data);
  };

  const getContestObjInfo = () => {
    const {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
      originalFileName,
      contestType,
      file,
    } = props.contestData;
    const data = {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
      originalFileName,
      contestType,
      file,
    };
    const defaultData = {};

    Object.keys(data).forEach((key) => {
      if (data[key]) {
        if (key === 'originalFileName') {
          defaultData.file = { name: data[key] };
        } else {
          defaultData[key] = data[key];
        }
      }
    });
    return defaultData;
  };

    const {
      isEditContest,
      contestData,
      changeEditContest,
      role,
      goChat,
      clearContestUpdationStore,
    } = props;
    const { error } = props.contestUpdationStore;
    const { id } = props.userStore.data;
    if (!isEditContest) {
      return (
        <ContestInfo
          userId={id}
          contestData={contestData}
          changeEditContest={changeEditContest}
          role={role}
          goChat={goChat}
        />
      );
    }
    return (
      <div className={styles.contestForm}>
        {error && (
          <Error
            data={error.data}
            status={error.status}
            clearError={clearContestUpdationStore}
          />
        )}
        <ContestForm
          contestType={contestData.contestType}
          defaultData={getContestObjInfo()}
          handleSubmit={(values) => setNewContestData(values)}
        />
      </div>
    );
  };


const mapStateToProps = (state) => {
  const { isEditContest } = state.contestByIdStore;
  const { contestUpdationStore, userStore } = state;
  return { contestUpdationStore, userStore, isEditContest };
};

const mapDispatchToProps = (dispatch) => ({
  update: (data) => dispatch(updateContest(data)),
  changeEditContest: (data) => dispatch(changeEditContest(data)),
  clearContestUpdationStore: () => dispatch(clearContestUpdationStore()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Brief));
