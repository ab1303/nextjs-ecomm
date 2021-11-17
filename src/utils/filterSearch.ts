import { NextRouter } from 'next/router';

type FilterSearchParams = {
  router: NextRouter;
  page: string | string[] | undefined;
  category: string | string[] | undefined;
  search: string | string[] | undefined;
  sort: string | string[] | undefined;
};

const filterSearch = ({
  router,
  page,
  category,
  sort,
  search,
}: FilterSearchParams) => {
  const path = router.pathname;
  const query = router.query;

  if (category) query.category = category;
  if (page) query.page = page;
  if (search) query.search = search;
  if (sort) query.sort = sort;

  router.push({
    pathname: path,
    query: query,
  });
};

export default filterSearch;
