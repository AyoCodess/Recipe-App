'use strict';

import { async } from 'regenerator-runtime';
// IMPORTANT stores funtions we use over and over again across our app.

// NS imports
import { TIMEOUT_DURATION } from './config.js';

//---------------

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_DURATION)]);
//     // console.log(res);

//     const data = await res.json();
//     // console.log(data);

//     if (!res.ok) throw new Error(`Failed to fetch recipe api, ${data.message}`);

//     return data;
//   } catch (err) {
//     throw err; // the promise from getJSON will reject and we can see that error as it propogates down. throwing it to model * check model.
//   }
// };

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_DURATION)]);
    // console.log(res);

    const data = await res.json();
    // console.log(data);

    if (!res.ok) throw new Error(`Failed to fetch recipe api, ${data.message}`);

    return data;
  } catch (err) {
    throw err;
  }
};

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_DURATION)]);
//     // console.log(res);

//     const data = await res.json();
//     // console.log(data);

//     if (!res.ok) throw new Error(`Failed to fetch recipe api, ${data.message}`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
