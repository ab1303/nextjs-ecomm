type FilterSearchParams = {
  router: {
    pathname: unknown;
    query: {
      category: string;
      page: unknown;
      search: unknown;
      sort: unknown;
    };
  };
  page: unknown;
  category: string;
  sort: unknown;
  search: unknown;
};

const filterSearch = ({
  router,
  page,
  category,
  sort,
  search,
}: FilterSearchParams) => {
  // const path = router.pathname;
  const query = router.query;

  if (category) query.category = category;
  if (page) query.page = page;
  if (search) query.search = search;
  if (sort) query.sort = sort;

  // TODO: Fix later
  //   router.push({
  //     pathname: path,
  //     query: query,
  //   });
};

export default filterSearch;
