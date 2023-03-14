import axios, { CreateAxiosDefaults } from 'axios';

export function configureAxiosInstance(defs: CreateAxiosDefaults) {
  return axios.create({
    ...defs,
  });
}
