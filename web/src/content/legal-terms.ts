import { company, money } from '../site';
import type { LegalDoc } from './types';

const p = company.pricing;
const e = company.emails;

export const terminos: LegalDoc = {
  slug: 'terminos',
  title: 'Términos y condiciones de uso',
  summary: 'Las reglas del acuerdo entre tú y Datecito cuando usas la app, el sitio web y nuestros servicios.',
  intro: [
    `Te damos la bienvenida a Datecito. Estos Términos y condiciones de uso (los “Términos”) forman un contrato vinculante entre tú y ${company.legalName} (“Datecito”, “nosotros”), con domicilio en ${company.address}. Regulan el uso de la aplicación móvil Datecito, del sitio web ${company.domain} y de cualquier otro servicio que ofrezcamos (en conjunto, el “Servicio”).`,
    { note: '**Por favor léelos con atención.** Al crear una cuenta o usar el Servicio aceptas estos Términos, nuestro Aviso de privacidad, la Política de cookies, los Términos de suscripción y las Normas de la comunidad. Si no estás de acuerdo, no uses el Servicio.' },
  ],
  sections: [
    {
      id: 'elegibilidad',
      h: '1. Quién puede usar Datecito',
      blocks: [
        'Para crear una cuenta y usar el Servicio declaras y garantizas que:',
        {
          ul: [
            'Tienes al menos 18 años cumplidos.',
            'Tienes capacidad legal para celebrar un contrato vinculante con Datecito.',
            'No tienes prohibido usar el Servicio conforme a las leyes de México o de cualquier otra jurisdicción aplicable.',
            'No tienes condena por un delito grave, violento o de naturaleza sexual, ni inscripción en ningún registro público de agresores sexuales.',
            'Cumplirás estos Términos y todas las leyes locales, estatales, nacionales e internacionales aplicables.',
            'No tienes otra cuenta activa en Datecito y no se te ha suspendido o eliminado previamente del Servicio, salvo autorización expresa nuestra.',
          ],
        },
        'Podemos solicitarte que verifiques tu edad o identidad en cualquier momento. Si detectamos que una persona menor de 18 años usa el Servicio, eliminaremos la cuenta de inmediato.',
      ],
    },
    {
      id: 'cuenta',
      h: '2. Tu cuenta',
      blocks: [
        'Te registras con tu correo electrónico y una contraseña; confirmamos que el correo es tuyo con un código de un solo uso. No usamos registro con número de celular ni con cuentas de terceros.',
        'Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que ocurra en tu cuenta. Si crees que alguien accedió a tu cuenta sin autorización, escríbenos de inmediato a ' + e.support + '.',
        'Tu cuenta es personal e intransferible. No puedes venderla, rentarla, cederla ni permitir que otra persona la use.',
      ],
    },
    {
      id: 'servicio',
      h: '3. Qué es (y qué no es) Datecito',
      blocks: [
        'Datecito es una plataforma para conocer personas, conversar y proponer encuentros (“datecitos”). Entre sus funciones están Descubrir, Quién te dio like, Matches, Chat, Datecitos, Aquí y ahora, Super likes, la verificación por selfie, los Contactos de confianza y Datecito Seguro.',
        'Datecito **no** es una agencia matrimonial, no organiza ni asiste a los encuentros, no hace reservaciones en lugares y no garantiza que encontrarás pareja, que recibirás matches ni que otras personas responderán tus mensajes.',
        'Podemos agregar, modificar o retirar funciones, temporal o permanentemente. Algunas funciones pueden estar disponibles sólo en ciertas ciudades, dispositivos o para personas con membresía.',
      ],
    },
    {
      id: 'conducta',
      h: '4. Tu conducta y la seguridad de la comunidad',
      blocks: [
        'Al usar Datecito te comprometes a tratar a las demás personas con respeto y a cumplir nuestras Normas de la comunidad. En particular, no debes:',
        {
          ul: [
            'Hacerte pasar por otra persona, mentir sobre tu edad o usar fotos que no son tuyas.',
            'Acosar, intimidar, amenazar, discriminar o difamar a cualquier persona, dentro o fuera de la app.',
            'Publicar o enviar contenido sexual explícito, desnudos, violencia gráfica o discursos de odio.',
            'Solicitar dinero, regalos, datos bancarios o inversiones, ni promover esquemas fraudulentos.',
            'Usar el Servicio para fines comerciales, publicitarios, de trabajo sexual, trata de personas o cualquier actividad ilegal.',
            'Publicar información personal de terceros (domicilio, teléfono, datos financieros) sin su consentimiento.',
            'Usar bots, scrapers, automatizaciones o cualquier medio no autorizado para acceder al Servicio o extraer información.',
            'Interferir con la seguridad o el funcionamiento del Servicio, o intentar eludir medidas técnicas o bloqueos.',
            'Grabar, difundir o amenazar con difundir imágenes íntimas de otra persona sin su consentimiento.',
          ],
        },
        'Datecito no realiza verificaciones de antecedentes penales de las personas usuarias. La verificación por selfie confirma que la persona coincide con sus fotos, pero no garantiza su identidad, intenciones ni comportamiento. **Tú eres responsable de tus interacciones** y te recomendamos seguir nuestros Consejos de seguridad.',
      ],
    },
    {
      id: 'contenido',
      h: '5. Contenido',
      blocks: [
        { h3: '5.1 Tu contenido' },
        'Eres responsable de las fotos, textos, mensajes y demás contenido que publiques o envíes (“Tu contenido”). Declaras que tienes los derechos necesarios sobre él y que no infringe derechos de terceros ni la ley.',
        'Conservas la titularidad de Tu contenido. Para operar el Servicio nos otorgas una licencia mundial, no exclusiva, gratuita, transferible y sublicenciable para alojar, almacenar, reproducir, adaptar (por ejemplo, recortar o comprimir), mostrar y distribuir Tu contenido dentro del Servicio y en materiales promocionales de Datecito sólo si nos das tu consentimiento expreso. Esta licencia termina cuando eliminas el contenido o tu cuenta, salvo copias que debamos conservar por obligación legal o de seguridad.',
        { h3: '5.2 Contenido de otras personas' },
        'El contenido de otras personas usuarias es responsabilidad de quien lo publica. No lo verificamos previamente, pero lo moderamos mediante revisión humana y reportes de la comunidad, y podemos retirarlo si incumple estas reglas.',
        { h3: '5.3 Nuestro contenido' },
        'El software, diseño, marcas, logotipos, textos e ilustraciones de Datecito son de nuestra propiedad o de nuestros licenciantes y están protegidos por la Ley Federal del Derecho de Autor y la Ley Federal de Protección a la Propiedad Industrial. Te otorgamos una licencia personal, limitada, revocable y no transferible para usar la app con fines personales y no comerciales.',
      ],
    },
    {
      id: 'compras',
      h: '6. Membresía y compras',
      blocks: [
        `Durante el periodo de lanzamiento el Servicio puede ofrecerse sin costo. Posteriormente, el acceso completo requerirá una membresía (mensual de ${money(p.monthly)} o anual de ${money(p.yearly)}, o su equivalente en moneda local mostrado por la tienda) y podrán adquirirse productos adicionales como paquetes de ${p.superPackQty} Super likes.`,
        'Las compras se realizan a través de Google Play o App Store y se rigen además por los Términos de suscripción de Datecito y por los términos de la tienda correspondiente. Las suscripciones se renuevan automáticamente salvo que las canceles al menos 24 horas antes del fin del periodo.',
      ],
    },
    {
      id: 'moderacion',
      h: '7. Reportes, suspensión y terminación',
      blocks: [
        'Puedes reportar perfiles, mensajes o conductas desde la app. Revisamos los reportes con discreción y no informamos a la persona reportada quién la reportó.',
        'Podemos advertir, limitar funciones, suspender o eliminar tu cuenta, sin previo aviso, si consideramos razonablemente que incumpliste estos Términos o las Normas de la comunidad, si tu conducta pone en riesgo a otras personas o si lo exige la ley. Si eliminamos tu cuenta por incumplimiento, no tendrás derecho a reembolso de compras, salvo lo que disponga la ley.',
        'Puedes eliminar tu cuenta en cualquier momento desde Perfil › Ajustes › Cuenta › Eliminar mi cuenta, o siguiendo las instrucciones de datecito.com/es/eliminar-cuenta. Eliminar la cuenta no cancela automáticamente una suscripción contratada a través de una tienda.',
      ],
    },
    {
      id: 'responsabilidad',
      h: '8. Exclusión de garantías y limitación de responsabilidad',
      blocks: [
        'El Servicio se ofrece “tal cual” y “según disponibilidad”. En la medida permitida por la ley, no garantizamos que sea ininterrumpido, libre de errores o seguro en todo momento.',
        'En la medida máxima permitida por la legislación aplicable, Datecito no será responsable por daños indirectos, incidentales, consecuenciales o punitivos, ni por la conducta, en línea o fuera de ella, de otras personas usuarias. Nuestra responsabilidad total frente a ti no excederá la cantidad que nos hayas pagado en los 12 meses anteriores al hecho que dé origen a la reclamación.',
        'Nada en estos Términos limita los derechos que te otorga la Ley Federal de Protección al Consumidor ni nuestra responsabilidad por dolo o negligencia grave.',
      ],
    },
    {
      id: 'indemnizacion',
      h: '9. Indemnización',
      blocks: ['Aceptas sacar en paz y a salvo a Datecito, sus filiales, personas consejeras, empleadas y agentes de cualquier reclamación, daño o gasto (incluidos honorarios razonables de abogados) derivados de tu incumplimiento de estos Términos, de Tu contenido o de tu conducta con otras personas usuarias.'],
    },
    {
      id: 'terceros',
      h: '10. Servicios de terceros',
      blocks: ['El Servicio puede mostrar enlaces o integraciones con servicios de terceros (por ejemplo, WhatsApp para avisar a tus contactos de confianza, o las tiendas de aplicaciones). No controlamos esos servicios y su uso se rige por sus propios términos y avisos de privacidad.'],
    },
    {
      id: 'disputas',
      h: '11. Ley aplicable y resolución de controversias',
      blocks: [
        'Estos Términos se rigen por las leyes federales de los Estados Unidos Mexicanos. Antes de iniciar cualquier reclamación, te pedimos que nos escribas a ' + e.legal + ' para intentar resolverla de buena fe en un plazo de 30 días.',
        'Para cualquier controversia, las partes se someten a la jurisdicción de los tribunales competentes de [Ciudad de México], renunciando a cualquier otro fuero, sin perjuicio de tu derecho a acudir a la Procuraduría Federal del Consumidor (PROFECO).',
      ],
    },
    {
      id: 'cambios',
      h: '12. Cambios a estos Términos',
      blocks: ['Podemos actualizar estos Términos para reflejar cambios en el Servicio o en la ley. Si los cambios son relevantes te avisaremos en la app o por correo con al menos 15 días de anticipación. Si sigues usando el Servicio después de la fecha de entrada en vigor, se entenderá que aceptas los Términos actualizados.'],
    },
    {
      id: 'contacto',
      h: '13. Contacto',
      blocks: [`Si tienes dudas sobre estos Términos escríbenos a ${e.legal} o a nuestro domicilio: ${company.address}.`],
    },
  ],
};

export const suscripciones: LegalDoc = {
  slug: 'suscripciones',
  title: 'Términos de suscripción y compras',
  summary: 'Precios, renovación automática, cancelación, reembolsos y compras dentro de la app.',
  intro: ['Estos Términos de suscripción complementan los Términos y condiciones de uso y aplican a cualquier membresía o producto que compres en Datecito.'],
  sections: [
    {
      id: 'productos',
      h: '1. Productos disponibles',
      blocks: [
        {
          table: {
            head: ['Producto', 'Precio de referencia', 'Incluye'],
            rows: [
              ['Membresía mensual', `${money(p.monthly)} / mes`, 'Ver quién te dio like; likes, chats y datecitos; Aquí y ahora en cualquier lugar; todos los filtros; 1 Super like gratis cada 3 días; Datecito Seguro y verificación.'],
              ['Membresía anual', `${money(p.yearly)} / año`, 'Todo lo de la mensual al precio de 10 meses: equivale a dos meses gratis.'],
              [`Paquete de ${p.superPackQty} Super likes`, money(p.superPack), 'Compra única. Los Super likes no caducan mientras tu cuenta esté activa.'],
            ],
          },
        },
        'Los precios están en pesos mexicanos. Fuera de México, tu tienda (Google Play o App Store) te mostrará el precio final en tu moneda, con impuestos incluidos, antes de confirmar el pago.',
        'Durante el periodo de lanzamiento podemos ofrecer el Servicio sin costo. Te avisaremos con anticipación antes de comenzar a cobrar y nunca te cobraremos sin que confirmes una compra.',
      ],
    },
    {
      id: 'renovacion',
      h: '2. Renovación automática',
      blocks: [
        'Las membresías se renuevan automáticamente al final de cada periodo por el mismo plazo y al precio vigente, con cargo al método de pago registrado en tu tienda, salvo que canceles al menos 24 horas antes de la fecha de renovación.',
        'Si el precio cambia, te lo notificaremos antes de que se aplique y, cuando la ley o la tienda lo requieran, solicitaremos tu consentimiento.',
      ],
    },
    {
      id: 'cancelacion',
      h: '3. Cómo cancelar',
      blocks: [
        { ul: ['**Android:** Google Play › Perfil › Pagos y suscripciones › Suscripciones › Datecito › Cancelar.', '**iPhone:** Ajustes › tu nombre › Suscripciones › Datecito › Cancelar suscripción.'] },
        'Al cancelar conservas los beneficios hasta el final del periodo ya pagado. Eliminar la app o tu cuenta no cancela la suscripción.',
      ],
    },
    {
      id: 'reembolsos',
      h: '4. Reembolsos',
      blocks: [
        'Como las compras se procesan por Google Play o App Store, las solicitudes de reembolso se gestionan conforme a las políticas de cada tienda. Datecito no puede emitir reembolsos directamente de compras hechas en las tiendas.',
        'Si crees que se te cobró por error, escríbenos a ' + e.support + ' y te ayudaremos con el proceso. Esto no limita los derechos que te otorga la Ley Federal de Protección al Consumidor.',
      ],
    },
    {
      id: 'virtuales',
      h: '5. Artículos virtuales',
      blocks: ['Los Super likes son licencias de uso limitadas, sin valor monetario, no reembolsables (salvo disposición legal) y no transferibles. No pueden canjearse por dinero. Si tu cuenta se elimina, los artículos no utilizados se pierden.'],
    },
    {
      id: 'promociones',
      h: '6. Promociones y códigos',
      blocks: ['Podemos ofrecer pruebas gratuitas, descuentos o códigos promocionales sujetos a condiciones específicas que se indicarán en cada promoción. Un código sólo puede canjearse una vez por cuenta, no es acumulable salvo indicación y no tiene valor en efectivo.'],
    },
    {
      id: 'profeco',
      h: '7. Atención al consumidor',
      blocks: [`Para aclaraciones escríbenos a ${e.support}. También puedes acudir a la Procuraduría Federal del Consumidor (PROFECO) en profeco.gob.mx o al Teléfono del Consumidor 55 5568 8722 / 800 468 8722.`],
    },
  ],
};

export const propiedadIntelectual: LegalDoc = {
  slug: 'propiedad-intelectual',
  title: 'Política de propiedad intelectual',
  summary: 'Cómo protegemos nuestras marcas y cómo reportar contenido que infrinja tus derechos.',
  intro: ['Datecito respeta los derechos de propiedad intelectual de terceros y espera lo mismo de las personas usuarias. Esta política explica cómo reportar una posible infracción y cómo usar nuestras marcas.'],
  sections: [
    {
      id: 'marcas',
      h: '1. Nuestras marcas',
      blocks: [
        '“Datecito”, el logotipo con corazón y destellos, “Aquí y ahora”, “Datecito Seguro” y demás signos distintivos son marcas de ' + company.legalName + '. No pueden usarse sin autorización previa y por escrito.',
        'Si quieres usar nuestra marca en prensa o alianzas, consulta los Recursos de marca o escríbenos a ' + e.press + '.',
      ],
    },
    {
      id: 'derechos-autor',
      h: '2. Reportar una infracción de derechos de autor',
      blocks: [
        'Si crees que un contenido publicado en Datecito infringe tus derechos de autor, envía un aviso a ' + e.ip + ' con la siguiente información:',
        {
          ol: [
            'Tu nombre completo, domicilio, teléfono y correo electrónico.',
            'Descripción de la obra protegida que consideras infringida.',
            'Ubicación precisa del contenido en Datecito (nombre del perfil, capturas de pantalla).',
            'Una declaración, bajo protesta de decir verdad, de que crees de buena fe que el uso no está autorizado por la persona titular, su representante o la ley.',
            'Una declaración de que la información del aviso es exacta y de que eres titular de los derechos o cuentas con autorización para actuar en su nombre.',
            'Tu firma física o electrónica.',
          ],
        },
        'Este procedimiento atiende las obligaciones de proveedores de servicios en línea previstas en la Ley Federal del Derecho de Autor. Podemos compartir el aviso con la persona que publicó el contenido para que, en su caso, presente un contraaviso.',
      ],
    },
    {
      id: 'marcas-terceros',
      h: '3. Reportar una infracción de marca',
      blocks: ['Si alguien usa tu marca en Datecito de forma que pueda causar confusión, envíanos a ' + e.ip + ' tus datos de contacto, el número de registro de la marca, la jurisdicción y la ubicación del contenido.'],
    },
    {
      id: 'reincidencia',
      h: '4. Reincidencia',
      blocks: ['Eliminaremos las cuentas de las personas que infrinjan de forma reiterada derechos de propiedad intelectual de terceros.'],
    },
  ],
};
