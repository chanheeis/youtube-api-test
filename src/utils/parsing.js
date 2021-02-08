const utils = {
  getUriFromObj : function (obj) {
    const keys = Object.keys(obj);
    let uriString = '?';
    keys.forEach((key, index) => {
      let value = Array.isArray(obj[key]) ? obj[key].join(',') : obj[key];
      
      //encodeURIComponent 코드 추가할 것
      uriString += `${key}=${value}`;
      if(index !== (keys.length - 1)) {
        uriString += '&';
      }
    });
    return uriString;
  }
}

export default utils;