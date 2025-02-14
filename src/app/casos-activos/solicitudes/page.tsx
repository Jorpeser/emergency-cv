import { Suspense } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { Solicitudes } from '.';
import { HelpRequestWAssignments } from '@/types/Requests';
import { FiltersData } from './types';

export const dynamic = 'force-dynamic';

function parseData(data: Database['public']['Tables']['help_requests']['Row'][]): HelpRequestWAssignments[] {
  return data.map((d) => {
    // Remove unused properties to reduce the payload size
    const { coordinates, location, ...rest } = d;
    return {
      ...rest,
      // Fix the coordinates to 3 decimals so locations have a 100m precision
      latitude: Number(d.latitude?.toFixed(3)),
      longitude: Number(d.longitude?.toFixed(3)),
    } as HelpRequestWAssignments;
  });
}

const getData = async (supabase: SupabaseClient<Database>, filters: FiltersData) => {
  const query = supabase
    .from('help_requests_with_assignment_count')
    .select('*', { count: 'exact' })
    .eq('type', 'necesita')
    .neq('status', 'finished');

  // Solo agregar filtro si es true o no se especificó
  if (filters.soloSinAsignar === undefined || filters.soloSinAsignar === 'true') {
    query.eq('assignments_count', 0);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error('Error fetching solicita:', error);
  }

  return parseData(data);
};

const getCount = async (supabase: SupabaseClient<Database>, filters: FiltersData) => {
  const query = supabase
    .from('help_requests_with_assignment_count')
    .select('id', { count: 'exact' })
    .eq('type', 'necesita')
    .neq('status', 'finished');

  // Solo agregar filtro si es true o no se especificó
  if (filters.soloSinAsignar === undefined || filters.soloSinAsignar === 'true') {
    query.eq('assignments_count', 0);
  }
  const { count: solicitaCount, error: solicitaError } = await query;

  const { count: ofreceCount, error: ofreceError } = await supabase
    .from('help_requests')
    .select('id', { count: 'exact' })
    .eq('type', 'ofrece')
    .neq('status', 'finished');

  if (solicitaError) {
    throw new Error('Error fetching solicita:', solicitaError);
  }
  if (ofreceError) {
    throw new Error('Error fetching ofrece:', ofreceError);
  }

  return {
    solicitudes: solicitaCount || 0,
    ofertas: ofreceCount || 0,
  };
};

export default async function SolicitudesPage(props: { searchParams: Promise<Record<string, string | undefined>> }) {
  const searchParams = (await props.searchParams) as FiltersData;
  const supabase = await createClient();
  const data = await getData(supabase, searchParams);
  const count = await getCount(supabase, searchParams);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <Solicitudes data={data} count={count} />
    </Suspense>
  );
}
