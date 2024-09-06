function sum(...a) {
  return a.reduce((acc, val) => acc + val, 0);
}

module.exports = sum;