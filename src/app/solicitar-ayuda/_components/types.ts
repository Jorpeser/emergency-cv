import { Town as SupabaseTown } from '@/types/Town';
import { Enums } from '@/types/common';
import { LngLat } from '@/components/map/GeolocationMap';

export type FormData = {
  nombre: string;
  contacto: string;
  email: string;
  numeroDePersonas: number | undefined;
  descripcion: string;
  urgencia: string;
  situacionEspecial: string;
  consentimiento: boolean;
  coordinates: LngLat | null;
  tiposDeAyuda: Map<HelpCategory['id'], boolean>;
  ubicacion: string;
  town: string;
};

export type HelpCategory = {
  id: number;
  label: string;
  enumLabel: Enums['help_type_enum'];
};

export type TipoDeAyudaInputRendererProps = Pick<HelpCategory, 'id' | 'label'> & {
  isSelected: boolean;
  handleTipoAyudaChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type Address = {
  road: string;
  house_number: string;
  postcode: string;
  city: string;
  state: string;
};

export type Status = {
  error: string | null;
  isSubmitting: boolean;
  success: boolean;
};

export type Town = Pick<SupabaseTown, 'id' | 'name'>;

export type HelpTypesMap = Map<HelpCategory['id'], { label: HelpCategory['label']; enum: Enums['help_type_enum'] }>;
