'use client';

import { Suspense } from 'react';
import { HeartHandshake } from 'lucide-react';
import { useSession } from '@/context/SessionProvider';
import OfferCard from '@/components/OfferCard';
import Link from 'next/link';
import { SelectedHelpData } from '@/types/Requests';
import { useQuery } from '@tanstack/react-query';
import { getOffersByUser } from '@/lib/actions';

export default function ListaSolicitudesPage() {
  return (
    <Suspense>
      <ListaSolicitudes />
    </Suspense>
  );
}

function ListaSolicitudes() {
  const session = useSession();
  const userId = session.user?.id;

  const { data, isLoading, error } = useQuery<SelectedHelpData[]>({
    queryKey: ['help_requests', { user_id: userId, type: 'ofrece' }],
    queryFn: () => getOffersByUser(userId || ''),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error?.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <div className="grid gap-4">
          {data.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
              <p className="text-gray-700 text-lg font-medium">
                No se encontraron solicitudes de ayuda correspondientes a tu cuenta.
              </p>
              <Link
                href="/ofrecer-ayuda"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 whitespace-nowrap"
              >
                <HeartHandshake className="w-5 h-5" />
                Ofrecer ayuda
              </Link>
            </div>
          ) : (
            data.map((caso) => <OfferCard showLink={true} showEdit={true} key={caso.id} caso={caso} />)
          )}
        </div>
      </div>
    </>
  );
}
