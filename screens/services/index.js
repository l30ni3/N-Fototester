const GLOBAL = require('../components/constants');

export const fetchResults = async () => {
  console.log('fetchResults call');
  const results = await fetch(`${GLOBAL.SERVER_URL}/api/results`)
    .then(r => r.json())
    .catch(error => {
      console.log(
        'There has been a problem with your fetch operation: ' + error.message,
      );
      // ADD THIS THROW error
      throw error;
    });

  console.log('fetchResults result', results);
  return results;
};

export const fetchResult = async itemId => {
  console.log('fetchResult call');
  const result = await fetch(`${GLOBAL.SERVER_URL}/api/results/${itemId}`)
    .then(r => r.json())
    .catch(error => {
      console.log(
        'There has been a problem with your fetch operation: ' + error.message,
      );
      throw error;
    });
  console.log('fetchResult result', result);
  return result;
};

export const deleteResult = async props => {
  console.log('in delete result: ', props.itemId);
  const results = await fetch(
    `${GLOBAL.SERVER_URL}/api/results/${props.itemId}/delete`,
  )
    .then(res => res.json())
    .catch(error => console.error(error));

  console.log('deleteResult result', results);
  return results;
};

export const uploadImage = async formData => {
  console.log('in upload image: ', formData);
  const response = await fetch(`${GLOBAL.SERVER_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.text())
    .catch(error => {
      console.log('upload error', error);
    });

  console.log('uploadImage result', response);
  return response;
};

export const fetchImage = name => {
  return `${GLOBAL.SERVER_URL}/api/images/${name}`;
};
