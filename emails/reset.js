const keys = require('../keys');

module.exports = function(to, token) {
  return {
    to,
    from: keys.EMAIL_FROM,
    subject: 'Password recovery',
    html: `
      <h1>Have you forgotten your password?</h1>
      <p>If no, ignore this message</p>
      <p>Otherwise click on link below:</p>
      <p><a href="${keys.BASE_URL}/auth/password/${token}">Restore access</a></p>
      <hr/>
      <a href="${keys.BASE_URL}">Course shop</a>
    `
  }
}