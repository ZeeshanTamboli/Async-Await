const axios = require('axios');

const getExchangeRate = async (from, to) => {
  try {
    const res = await axios.get(`https://api.fixer.io/latest?base=${from}`);
    const rate = res.data.rates[to];

    if (rate) {
      return rate;
    } else {
      throw new Error();
    }
  } catch (e) {
    throw new Error(`Unable to get exchange rate for ${from} and ${to}`);
  }
};

const getCountries = async currencyCode => {
  try {
    const res = await axios.get(
      `https://restcountries.eu/rest/v2/currency/${currencyCode}`
    );
    return res.data.map(country => country.name);
  } catch (e) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

//Using promises
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

//Using async/await
const convertCurrencyAlt = async (from, to, amount) => {
  const countries = await getCountries(to);
  const rate = await getExchangeRate(from, to);

  const exchangedAmount = rate * amount;

  return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used in the following countries: ${countries.join(
    ', '
  )}`;
};

convertCurrencyAlt('USD', 'INR', 2)
  .then(status => console.log(status))
  .catch(e => console.log(e.message));
