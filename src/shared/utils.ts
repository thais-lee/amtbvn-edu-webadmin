import type { THttpResponse } from './http-service';

export const transformGetQuery = (input: any) => {
  const res = Object.entries(input).reduce((acc: any, [key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        acc[`${key}`] = v;
      });
    } else {
      acc[`${key}`] = value;
    }
    return acc;
  }, {});

  return res;
};

export const transApiResCode = (t: any, code?: number) => {
  if (code === undefined) return 'ApiResCode.1';

  return t(`ApiResCode.${code}`);
};

export const transApiResDataCode = (t: any, data?: THttpResponse<any>) => {
  if (data === undefined) return 'ApiResCode.1';

  if (isNaN(data.code)) return 'ApiResCode.1';

  return t(`ApiResCode.${data.code}`);
};

export const removeVietnameseAccents = (str: string) => {
  // remove accents
  const from =
      'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷđ',
    to =
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyyd';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i]);
  }

  str = str.toLowerCase().trim();
  // .replace(/[^a-z0-9\\-]/g, '-')
  // .replace(/-+/g, '-');

  return str;
};

export const searchStr = (input: string, search: string) => {
  return removeVietnameseAccents(input.toLowerCase()).includes(
    removeVietnameseAccents(search.toLowerCase()),
  );
};

export const isDefined = (value?: any) => {
  return value !== undefined && value !== null;
};

export const isNumberString = (value: string) => {
  return !isNaN(Number(value));
};

export const randomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

export const styledOmit$PropsOptions = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
};
