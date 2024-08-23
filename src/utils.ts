export const isNameValid = (name: string) => {
  return name.match(/^[a-zA-Z]+ [a-zA-Z]+$/);
};

export const isEmailValid = (email: string) => {
  return email.match(/^(.+)@(.+)$/);
};

export const isDateValid = (date: string) => {
  return date.match(/^\d{4}-\d{2}-\d{2}$/);
};
