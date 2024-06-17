const getData = (jsonFilePath) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', jsonFilePath);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      reject(Error('Network Error'));
    };
    xhr.send();
  });
};
export default getData;