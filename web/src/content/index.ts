import { useLang } from '../i18n';
import * as enEditorial from './en/editorial';
import * as enHelp from './en/help';
import * as enPolicies from './en/legal-policies';
import * as enPrivacy from './en/legal-privacy';
import * as enTerms from './en/legal-terms';
import * as esEditorial from './editorial';
import * as esHelp from './help';
import * as esPolicies from './legal-policies';
import * as esPrivacy from './legal-privacy';
import * as esTerms from './legal-terms';

const content = {
  es: { ...esTerms, ...esPrivacy, ...esPolicies, ...esHelp, ...esEditorial },
  en: { ...enTerms, ...enPrivacy, ...enPolicies, ...enHelp, ...enEditorial },
};

/** Contenido largo (legal, ayuda, blog, empleos…) en el idioma de la URL. */
export function useContent() {
  return content[useLang()];
}
