
export const validateCode = (code: string): boolean => {
  return /^\d{4}$/.test(code);
};

export const handleCodeChange = (value: string, setter: (value: string) => void): void => {
  // Only allow numeric input and limit to 4 digits
  const numericValue = value.replace(/\D/g, '').slice(0, 4);
  setter(numericValue);
};
