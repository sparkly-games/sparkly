# Contributions

Please fill out the sections below and ensure your update follows all of the standards outlined in the `contributions.md` file.

---

## Security Checklist

Check these FIRST. If this fails, the Contribution won't be accepted.

### Frontend Security

- [ ] **Use HTTPS everywhere**
  - Prevents basic eavesdropping and man-in-the-middle attacks.
- [ ] **Input validation and sanitization**
  - Prevents XSS attacks by validating all user inputs.
- [ ] **Don't store sensitive data in the browser**
  - No secrets in `localStorage` or client-side code.
- [ ] **CSRF protection**
  - Implement anti-CSRF tokens for forms and state-changing requests.
- [ ] **Never expose API keys in frontend**
  - API credentials should always remain server-side.

### Practical Security Habits

- [ ] **Keep dependencies updated**
  - Most vulnerabilities come from outdated libraries.
- [ ] **Proper error handling**
  - Don't expose sensitive details in error messages.
- [ ] **Secure cookies**
  - Set `HttpOnly`, `Secure` and `SameSite` attributes.

---

## Changelog Update

Please update the `CHANGELOG.md` file at the VERY top with the version name `CONTRIBUTION.[4-digits]` and your username in square brackets, following this format:

### CONTRIBUTION.[4-digits] [ Contribution - @your-username ]
- [ ] Describe the changes you made here.
- [ ] ...
