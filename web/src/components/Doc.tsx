import type { Block, LegalDoc } from '../content/types';
import { useLang, useT } from '../i18n';
import { company } from '../site';
import { PageHero, Rich, type Crumb } from './ui';

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (typeof b === 'string')
          return (
            <p key={i}>
              <Rich text={b} />
            </p>
          );
        if ('ul' in b)
          return (
            <ul key={i}>
              {b.ul.map((t) => (
                <li key={t}>
                  <Rich text={t} />
                </li>
              ))}
            </ul>
          );
        if ('ol' in b)
          return (
            <ol key={i}>
              {b.ol.map((t) => (
                <li key={t}>
                  <Rich text={t} />
                </li>
              ))}
            </ol>
          );
        if ('h3' in b) return <h3 key={i}>{b.h3}</h3>;
        if ('note' in b)
          return (
            <div key={i} className="notice" style={{ margin: '0 0 1em' }}>
              <Rich text={b.note} />
            </div>
          );
        return (
          <div key={i} className="table-wrap">
            <table>
              <thead>
                <tr>
                  {b.table.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.table.rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, j) => (
                      <td key={j}>
                        <Rich text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

export function DocPage({ doc, crumbs, eyebrow = 'Legal' }: { doc: LegalDoc; crumbs: Crumb[]; eyebrow?: string }) {
  const t = useT();
  const lang = useLang();
  return (
    <>
      <PageHero eyebrow={eyebrow} title={doc.title} lead={doc.summary} crumbs={crumbs}>
        <p className="small muted" style={{ marginTop: 12 }}>
          {t('Última actualización', 'Last updated')}: {company.updated[lang]}
        </p>
      </PageHero>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container legal-layout">
          <aside className="toc" aria-label={t('Contenido', 'Contents')}>
            <strong>{t('En esta página', 'On this page')}</strong>
            {doc.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.h}
              </a>
            ))}
          </aside>
          <article className="legal-body">
            {lang === 'en' ? (
              <div className="notice green" style={{ marginBottom: 24 }}>
                This English version is provided for convenience. If there is any discrepancy, the Spanish version prevails.
              </div>
            ) : null}
            <Blocks blocks={doc.intro} />
            {doc.sections.map((s) => (
              <section key={s.id}>
                <h2 id={s.id}>{s.h}</h2>
                <Blocks blocks={s.blocks} />
              </section>
            ))}
            <div className="notice" style={{ marginTop: 32 }}>
              {t('Los textos resaltados como ', 'Text highlighted ')}
              <span className="ph">{t('[así]', '[like this]')}</span>
              {t(' son datos pendientes de completar. Este documento es un borrador sujeto a revisión legal.', ' is pending information. This document is a draft subject to legal review.')}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
