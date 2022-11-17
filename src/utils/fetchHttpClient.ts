// const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

// // eslint-disable-next-line no-console
// console.log('NEXT_PUBLIC_API_URL:', baseUrl);

export const getData = async (url: string, token?: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: token ? token : '',
    },
  });

  const data = await res.json();
  return data;
};

export const postData = async (url: string, body: unknown, token?: string) => {
  const headers: { 'Content-Type': string; Authorization?: string } = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = token;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return {
    ok: res.ok,
    ...data,
  };
};

export const putData = async (url: string, body: unknown, token?: string) => {
  const headers: { 'Content-Type': string; Authorization?: string } = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = token;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return {
    ok: res.ok,
    ...data,
  };
};

export const patchData = async (url: string, body: unknown, token: string) => {
  const headers: { 'Content-Type': string; Authorization?: string } = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = token;

  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return {
    ok: res.ok,
    ...data,
  };
};

export const deleteData = async (url: string, token?: string) => {
  const headers: { 'Content-Type': string; Authorization?: string } = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = token;

  const res = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  const data = await res.json();
  return {
    ok: res.ok,
    ...data,
  };
};
