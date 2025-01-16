export const REQUESTMETHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
}
export const ErrorMessage = {
    EMAILREQUIRE: 'The Email id is required',
    EMAILINVALID: 'Please enter a valid Email Id',
  
    PASSWORDREQUIRE: 'The Password is required',
    PASSWORDINVALID: 'Please enter a valid Password',
    PASSWORDINVALIDSTR: 'Please enter a valid password (e.g., Example@123)',
  };
  
  const PASSWORDREGEX =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,16}$/;
  const EMAILREGEX =
    /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<![_.])$/;
  
  export const ValidateEmail = (email) =>
    email !== ''
      ? EMAILREGEX.test(email)
        ? ''
        : ErrorMessage.EMAILINVALID
      : ErrorMessage.EMAILREQUIRE;
  
  export const ValidatePasswordStrong = (password) =>
    password !== ''
      ? PASSWORDREGEX.test(password)
        ? ''
        : ErrorMessage.PASSWORDINVALID
      : ErrorMessage.PASSWORDREQUIRE;
  