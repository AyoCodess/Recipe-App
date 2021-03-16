('use strict');

export const getEnvVariable = (property, canBeUndefined = false) => {
  const value = process.env[property];

  if (!canBeUndefined && !value) {
    throw new Error(`${property} environment variable is not set`);
  }

  return value;
};

// IMPORTANT this file is used to store all the varibles that are constants and will allow us to easily configure our project my ediiting the varibles in this file.

// NS COnsTANTS THAT NEVER CHANGE

export const API_URL = `https://forkify-api.herokuapp.com/api/v2/recipes/`;

export const TIMEOUT_DURATION = 10;

export const RES_PER_PAGE = 10;

export const API_KEY = getEnvVariable('RECIPES_API_KEY');

export const MODAL_CLOSE_SEC = 2000;
