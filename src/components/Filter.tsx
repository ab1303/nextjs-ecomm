import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { GlobalState } from '@/store/GlobalStore';
import filterSearch from '@/utils/filterSearch';

const Filter = ({ state }: { state: GlobalState }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');

  const { categories } = state;

  const router = useRouter();

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    filterSearch({
      router,
      category: e.target.value,
      page: undefined,
      sort: undefined,
      search: undefined,
    });
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    filterSearch({
      router,
      sort: e.target.value,
      search: undefined,
      page: undefined,
      category: undefined,
    });
  };

  useEffect(() => {
    filterSearch({
      router,
      search: search ? search.toLowerCase() : 'all',
      sort: undefined,
      page: undefined,
      category: undefined,
    });
  }, [search, router]);

  return (
    <div className='input-group'>
      <div className='input-group-prepend col-md-2 px-0 mt-2'>
        <select
          className='custom-select text-capitalize'
          value={category}
          onChange={handleCategory}
        >
          <option value='all'>All Products</option>

          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <form autoComplete='off' className='mt-2 col-md-8 px-0'>
        <input
          type='text'
          className='form-control'
          list='title_product'
          value={search.toLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className='input-group-prepend col-md-2 px-0 mt-2'>
        <select
          className='custom-select text-capitalize'
          value={sort}
          onChange={handleSort}
        >
          <option value='-createdAt'>Newest</option>
          <option value='oldest'>Oldest</option>
          <option value='-sold'>Best sales</option>
          <option value='-price'>Price: Hight-Low</option>
          <option value='price'>Price: Low-Hight</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
