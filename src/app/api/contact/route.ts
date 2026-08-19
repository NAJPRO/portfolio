import {NextResponse} from 'next/server';
import {contactSchema} from '@/features/contact/schema';
import {getMailer} from '@/lib/mailer';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const MAX_TRACKED_CLIENTS = 500;

/**
 * Limitation en mémoire du processus. Sur un hébergement sans état partagé, chaque
 * instance compte pour elle : c'est un frein contre l'abus ordinaire, pas une garantie.
 * Un compteur partagé demanderait un stockage, hors périmètre à ce stade.
 */
const submissionsByClient = new Map<string, number[]>();

function pruneStaleClients(now: number) {
  if (submissionsByClient.size <= MAX_TRACKED_CLIENTS) return;
  for (const [client, timestamps] of submissionsByClient) {
    if (timestamps.every((at) => now - at >= WINDOW_MS)) {
      submissionsByClient.delete(client);
    }
  }
}

function exceedsRateLimit(client: string): boolean {
  const now = Date.now();
  const recent = (submissionsByClient.get(client) ?? []).filter(
    (at) => now - at < WINDOW_MS
  );
  recent.push(now);
  submissionsByClient.set(client, recent);
  pruneStaleClients(now);

  return recent.length > MAX_SUBMISSIONS_PER_WINDOW;
}

function identifyClient(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? 'unknown';
}

/**
 * La réponse ne contient jamais de phrase à afficher : le client possède les
 * catalogues et rend le message dans la langue courante. Le code d'erreur suffit.
 */
export async function POST(request: Request) {
  if (exceedsRateLimit(identifyClient(request))) {
    return NextResponse.json(
      {success: false, error: 'rateLimited'},
      {status: 429}
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({success: false, error: 'malformed'}, {status: 400});
  }

  const result = contactSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'validation',
        issues: result.error.issues.map((issue) => ({
          field: String(issue.path[0] ?? ''),
          code: issue.message
        }))
      },
      {status: 400}
    );
  }

  // Champ leurre rempli : la requête vient d'un robot. La réponse imite un succès pour
  // ne pas lui apprendre l'existence du piège, et rien n'est envoyé.
  if (result.data.company) {
    return NextResponse.json({success: true}, {status: 201});
  }

  try {
    await getMailer().send(result.data);
  } catch (error) {
    console.error('[contact] envoi impossible', error);
    return NextResponse.json({success: false, error: 'transport'}, {status: 502});
  }

  return NextResponse.json({success: true}, {status: 201});
}
