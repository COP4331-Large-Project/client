async function onInputChange(event) {
  const formInfo = new FormData(event.target);
  const data = Object.formEntries(formInfo);
  if (!data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/gm)) {
    throw (new Error('Your password must be at least 8 characters long, contain a lowercase letter, uppercase letter, number, and special character.'));
  }
}

export default onInputChange;
