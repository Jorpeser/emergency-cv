create table "public"."crm_users_log" (
    "help_request_id" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "email" character varying,
    "user_id" uuid,
    "diff" text,
    "id" bigint generated by default as identity not null
);


alter table "public"."crm_users_log" enable row level security;

CREATE UNIQUE INDEX crm_users_log_pkey ON public.crm_users_log USING btree (id);

alter table "public"."crm_users_log" add constraint "crm_users_log_pkey" PRIMARY KEY using index "crm_users_log_pkey";

alter table "public"."crm_users_log" add constraint "crm_users_log_help_request_id_fkey" FOREIGN KEY (help_request_id) REFERENCES help_requests(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."crm_users_log" validate constraint "crm_users_log_help_request_id_fkey";

alter table "public"."crm_users_log" add constraint "crm_users_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."crm_users_log" validate constraint "crm_users_log_user_id_fkey";

grant delete on table "public"."crm_users_log" to "anon";

grant insert on table "public"."crm_users_log" to "anon";

grant references on table "public"."crm_users_log" to "anon";

grant select on table "public"."crm_users_log" to "anon";

grant trigger on table "public"."crm_users_log" to "anon";

grant truncate on table "public"."crm_users_log" to "anon";

grant update on table "public"."crm_users_log" to "anon";

grant delete on table "public"."crm_users_log" to "authenticated";

grant insert on table "public"."crm_users_log" to "authenticated";

grant references on table "public"."crm_users_log" to "authenticated";

grant select on table "public"."crm_users_log" to "authenticated";

grant trigger on table "public"."crm_users_log" to "authenticated";

grant truncate on table "public"."crm_users_log" to "authenticated";

grant update on table "public"."crm_users_log" to "authenticated";

grant delete on table "public"."crm_users_log" to "service_role";

grant insert on table "public"."crm_users_log" to "service_role";

grant references on table "public"."crm_users_log" to "service_role";

grant select on table "public"."crm_users_log" to "service_role";

grant trigger on table "public"."crm_users_log" to "service_role";

grant truncate on table "public"."crm_users_log" to "service_role";

grant update on table "public"."crm_users_log" to "service_role";

create policy "Enable insert for admins"
on "public"."crm_users_log"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::roles)))));


create policy "Enable insert for moderators"
on "public"."crm_users_log"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'moderator'::roles)))));


create policy "Enable read for moderators"
on "public"."crm_users_log"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'moderator'::roles)))));


create policy "Enable reads for admins"
on "public"."crm_users_log"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::roles)))));



