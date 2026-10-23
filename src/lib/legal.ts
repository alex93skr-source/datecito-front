// Los textos legales se leen directo del sitio web (web/src/content): una sola fuente,
// así la app y datecito.com siempre dicen exactamente lo mismo.
import { normas } from '../../web/src/content/legal-policies';
import { cookies, datosSensibles, privacidad } from '../../web/src/content/legal-privacy';
import { propiedadIntelectual, suscripciones, terminos } from '../../web/src/content/legal-terms';
import type { Block, LegalDoc } from '../../web/src/content/types';
import { company } from '../../web/src/site';

export type { Block, LegalDoc };

/** Documentos que se muestran en la app, en este orden. */
export const legalDocs: LegalDoc[] = [terminos, privacidad, suscripciones, normas, datosSensibles, propiedadIntelectual, cookies];

export const legalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);

export const legalUpdated = company.updated.es;
