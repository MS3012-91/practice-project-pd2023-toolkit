import React, {useState} from 'react';
import { Formik, Field, useField } from 'formik';

const FieldFileInput = props => {
  // const [field, meta, helpers] = useField(props.name);
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = props.classes;
  const {formikProps, ...rest } = props;
  const [field, , helpers] = useField(rest);
  // ({ classes, setFieldValue, ...rest }) => {
  // const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;

  const getFileName = () => {
    if (field.value) {
      console.log('props.field.value', field.value.name);
      return field.value.name;
    }
    return '';
  };

  // return (
  //   <Field name={rest.name}>
  //     {props => {
  //       const { field, form,} = props; 
  //       const getFileName = () => {
  //         if (field.value) {
  //           console.log('props.field.valu', field.value.name);
  //           return field.value.name;
  //         }
  //         return '';
  //       };

        return (
          <div className={fileUploadContainer}>
            <label htmlFor="fileInput" className={labelClass}>
              Choose file
            </label>
            <span id="fileNameContainer" className={fileNameClass}>
              {getFileName()}
            </span>
            <input
              {...field}
              className={fileInput}
              id="fileInput"
              key="file"
              type="file"
              accept=".jpg, .png, .jpeg"
              value= ''
              onChange={(e) => {
                const file = e.target.files[0];
                const imageType = /image.*/;
                if (!file.type.match(imageType)) {
                  e.target.value = '';
                  console.log('Incorrect file type');
                } else {
                   console.log('Selected file:', file);
                  helpers.setValue( e.target.files[0]);
                  
                  }
              }}
            />
          </div>
        );
      }


export default FieldFileInput;
