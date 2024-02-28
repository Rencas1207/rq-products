import {
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getProduct,
  getProducts,
  getProjects,
  getTodo,
  getTodosIds,
} from './api';
import { Product } from '../types/product';

export const useTodosIds = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodosIds,
    //  refetchOnWindowFocus: false,
    //  enabled: true
  });
};

export const useTodos = (ids: (number | undefined)[] | undefined) => {
  return useQueries({
    queries: (ids ?? []).map((id) => {
      return {
        queryKey: ['todo', { id }],
        queryFn: () => getTodo(id!),
      };
    }),
  });
};

export const useProjects = (page: number) => {
  return useQuery({
    queryKey: ['projects', { page }],
    queryFn: () => getProjects(page),
    placeholderData: keepPreviousData,
  });
};

export const useProducts = () => {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) return undefined;
      return firstPageParam + 1;
    },
  });
};

export const useProduct = (id: number | null) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['product', { id }],
    queryFn: () => getProduct(id!),
    enabled: !!id,
    placeholderData: () => {
      const cacheProducts = (
        queryClient.getQueryData(['products']) as {
          pages: Product[] | undefined;
        }
      )?.pages?.flat(2);

      if (cacheProducts) {
        return cacheProducts.find((item) => item.id === id);
      }
    },
  });
};
