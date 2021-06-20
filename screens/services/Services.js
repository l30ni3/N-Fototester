const GLOBAL = require('../components/constants');

export const fetchResults = async () =>
  fetch(`${GLOBAL.SERVER_URL}/api/results`).then(r => r.json());

export const deleteResult = async props => {
  console.log('in delete result: ', props.itemId);
  fetch(`${GLOBAL.SERVER_URL}/api/results/${props.itemId}/delete`)
    .then(res => res.json())
    .catch(error => console.error(error));
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
  return response;
};
