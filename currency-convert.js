const axios = require('axios');

const getExchangeRate = (from, to) => {
  return axios.get(`https://api.fixer.io/latest?base=${from}`).then(res => {
    return res.data.rates[to];
  });
};

const getCountries = currencyCode => {
  return axios
    .get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`)
    .then(res => {
      return res.data.map(country => country.name);
    });
};

const convertCurrency = (from, to, amount) => {
  let countries;
  return getCountries(to).then(tempCountries => {
    countries = tempCountries;
    return getExchangeRate(from, to).then(rate => {
      const exchangedAmount = rate * amount;

      return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used in the following countries: ${countries.join(
        ', '
      )}`;
    });
  });
};

convertCurrency('USD', 'INR', 100).then(status => console.log(status));