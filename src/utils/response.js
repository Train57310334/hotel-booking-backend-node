export const ok = (res, message, result = []) => res.json({ status: 1, message, result });
export const fail = (res, message, code = 400, result = []) => res.status(code).json({ status: 0, message, result });
