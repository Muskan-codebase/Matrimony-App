import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interface/error.interface';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract field name from keyPattern
  const field = Object.keys(err.keyPattern || {})[0] || 'unknown';

  // Extract value from keyValue
  const value = err.keyValue?.[field] || 'unknown';

  const errorSources: TErrorSources = [
    {
      path: field, // ✅ NOW shows which field!
      message: `${field}: "${value}" already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: `Duplicate ${field} error`, // ✅ Clear message
    errorSources,
  };
};

export default handleDuplicateError;
