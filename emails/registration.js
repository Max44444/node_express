const keys = require('../keys');

module.exports = function(to) {
  return {
    to,
    from: keys.EMAIL_FROM,
    subject: 'Registration completed successfully',
    html: `
      <h1>Wellcome to our course shop</h1>
      <p>You have successfully created an account with email: ${to}</p>
      <hr/>
      <a href="${keys.BASE_URL}">Course shop</a>
    `
  }
}