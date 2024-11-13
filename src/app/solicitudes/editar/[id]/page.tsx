import Unauthorized from '@/components/Unauthorized';
import { helpRequestService } from '@/lib/actions';
import { createClient } from '@/lib/supabase/server';
import EditHelpRequest from '@/components/HelpRequests/EditHelpRequest';

export default async function EditarSolicitud({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (session.user === null) {
    return <Unauthorized />;
  }
  const request = await helpRequestService.getOneWithCoords(Number(id));

  return <EditHelpRequest request={request} />;
}
