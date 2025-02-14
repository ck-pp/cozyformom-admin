import { storageKeys } from '../constants/sessionStorage.ts';

 const storage = sessionStorage;

 export const getAccessToken = () => {
   const key = storageKeys.accessToken;
   return storage.getItem(key);
 };

 export const setAccessToken = (token: string) => {
   const key = storageKeys.accessToken;
   storage.setItem(key, token);
 };

 export const removeAccessToken = () => {
   const key = storageKeys.accessToken;
   storage.removeItem(key);
 }