// ./src/App.tsx

import React, { useState, useEffect } from 'react';
import uploadFileToBlob, { isStorageConfigured, getBlobsInContainer } from './azure-storage-blob';
import DisplayImagesFromContainer from './ContainerImages';
const storageConfigured = isStorageConfigured();

const App = () => {
  // all blobs in container
  const [blobList, setBlobList] = useState([]);

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState();
  const [fileUploaded, setFileUploaded] = useState('');

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  // *** GET FILES IN CONTAINER ***
  useEffect(() => {
    getBlobsInContainer().then((list) =>{
      // prepare UI for results
      setBlobList(list);
    })
  }, [fileUploaded]);

  const onFileChange = (event) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };
  function getExtension(filename) {
    return filename.split('.').pop().toLowerCase()
  }
  const onFileUpload = async () => {

    const extensionFlag = getExtension(fileSelected?.name) === 'csv' ? true:false;
    if (!extensionFlag)
      alert('Only .CSV file are allowed to upload'); 
    
    if(fileSelected && fileSelected?.name && extensionFlag){
    // prepare UI 
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    await uploadFileToBlob(fileSelected);

    // reset state/form
    setFileSelected(null);
    setFileUploaded(fileSelected.name);
    setUploading(false);
    setInputKey(Math.random().toString(36));

    }

  };

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} key={inputKey || ''} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
          </button>
    </div>
  )

  return (
    <div>
      <h1>Upload CSV file to keep resources in Maintenance mode</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {storageConfigured && blobList.length > 0 && <DisplayImagesFromContainer blobList={blobList}/>}
      {!storageConfigured && <div>Storage is not configured.</div>}
    </div>
  );
};

export default App;


