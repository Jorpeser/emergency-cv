'use client';

import { useQuery } from '@tanstack/react-query';
import { townService } from '@/lib/service';
import { Town } from '@/types/Town';

export const useTowns = () => {
  const {
    data: towns,
    isLoading,
    error,
  } = useQuery<Town[]>({
    queryKey: ['towns'],
    queryFn: () => townService.getTowns(),
  });

  const getTownById = (id: number) => towns?.find((t) => t.id === id);

  return { towns: towns ?? [], isLoading, error, getTownById };
};
