const GLOBAL = require('../components/constants');

export const fetchResults = async () => {
  console.log('fetchResults call');
  const results = await fetch(`${GLOBAL.SERVER_URL}/api/results`)
    .then(r => r.json())
    .catch(error => {
      throw error;
    });

  return results;
};

export const fetchResult = async itemId => {
  const result = await fetch(`${GLOBAL.SERVER_URL}/api/results/${itemId}`)
    .then(r => r.json())
    .catch(error => {
      throw error;
    });
  return result;
};

export const deleteResult = async props => {
  const results = await fetch(
    `${GLOBAL.SERVER_URL}/api/results/${props.itemId}/delete`,
  )
    .then(res => res.json())
    .catch(error => {
      throw error;
    });

  return results;
};

export const uploadImage = async formData => {
  const response = await fetch(`${GLOBAL.SERVER_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.text())
    .catch(error => {
      throw error;
    });

  return response;
};

export const fetchImage = name => {
  return `${GLOBAL.SERVER_URL}/api/images/${name}`;
};
