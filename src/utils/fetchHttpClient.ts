const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export const getData = async (url: string, token?: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'GET',
    headers: {
      Authorization: token ? token : '',
    },
  });

  const data = await res.json();
  return data;
};

export const postData = async (url: string, post: unknown, token?: string) => {
  const headers: { 'Content-Type': string; Authorization?: string } = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = token;

  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const putData = async (url: string, post: unknown, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const patchData = async (url: string, post: unknown, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const deleteData = async (url: string, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  const data = await res.json();
  return data;
};
