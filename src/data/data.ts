import { ProductEntity } from 'src/products/repositories/entities/product.entity';

export const products = [
  {
    id: 1,
    slug: 'enzunchadoras-electricas', // unico por producto
    srcImg: [
      'https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/enzunchadoraelectrica.jpg',
      'https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/enzunchadora.jpg',
    ],
    alt: 'enzunchadora-electrica',
    idCategory: 1,
    name: 'Enzunchadora a Batería P328/P329',
    subtitle: 'Enzunchadoras eléctricas',
    desc: `<p className="my-5">
            La FROMM P328 es una flejadora a batería para flejes de PET y PP y
            es adecuada para la mayoría de aplicaciones de flejado.
          </p>
          <p className="my-5">
            Con la FROMM p328 podrá flejar fácilmente todos los tamaños de
            flejes de polipropileno (PP) y poliéster (PET) hasta un ancho de 16
            mm.
          </p>
          <ul className="flex flex-col gap-5 my-5">
            <li className="flex gap-2 items-center">
              <img src="/icons/checkList.svg" />
              <p>Carcasa resistente</p>
            </li>
            <li className="flex gap-2 items-center">
              <img src="/icons/checkList.svg" />
              <p>
                Muy bajo mantenimiento gracias al mínimo de piezas móviles y al
                motor sin escobillas
              </p>
            </li>
            <li className="flex gap-2 items-center">
              <img src="/icons/checkList.svg" />
              <p>Vida útil más larga</p>
            </li>
            <li className="flex gap-2 items-center">
              <img src="/icons/checkList.svg" />
              <p>Más ligero de usar gracias a su diseño inteligente</p>
            </li>
          </ul>`,
    moreInfo: {
      specifications: [
        {
          key: 'Dimensiones de la máquina:',
          value: 'Largo 351 x Ancho 134 x Alto 143 mm',
        },
        {
          key: 'Fuerza de tensión:',
          value: '250 - 2.600 N (infinitamente variable)',
        },
        {
          key: 'Adecuada para:',
          value:
            'Fleje de PP y PET en anchos de 12,0 - 16,0 mm y espesores de 0,40 - 1,05 mm',
        },
        {
          key: 'Velocidad de expansión:',
          value: '67 - 124 mm/sec.',
        },
        {
          key: 'Calidad media de la soldadura',
          value:
            'Aproximadamente el 75 %, dependiendo de la calidad del neumático.',
        },
        {
          key: 'Corriente',
          value: 'Batería 18V / 4.0Ah Li-ion',
        },
        {
          key: 'Peso:',
          value: '4.3 kg (incl. 4.0 Ah battery)',
        },
      ],
      information:
        '<p className="my-3">\n          Herramienta flejadora a batería para fleje de PET y fleje de PP para\n          las aplicaciones más comunes.\n        </p>\n        <p className="my-3">\n          Con la P328 podrá flejar fácilmente todos los tamaños de flejes de\n          polipropileno (PP) y poliéster (PET) de hasta 16 mm.\n        </p>\n        <h2 className="text-textGray font-bold text-xl mt-10">\n          Beneficios P328\n        </h2>\n        <ul className="flex flex-col gap-5 my-5">\n          <li className="flex gap-2 items-center">\n            <img src="/icons/checkList.svg" />\n            <p>Carcasa resistente</p>\n          </li>\n          <li className="flex gap-2 items-center">\n            <img src="/icons/checkList.svg" />\n            <p>Muy poco mantenimiento</p>\n          </li>\n          <li className="flex gap-2 items-center">\n            <img src="/icons/checkList.svg" />\n            <p>Larga vida útil</p>\n          </li>\n          <li className="flex gap-2 items-center">\n            <img src="/icons/checkList.svg" />\n            <p>Ligero de usar gracias a su diseño inteligente</p>\n          </li>\n          <li className="flex gap-2 items-center">\n            <img src="/icons/checkList.svg" />\n            <p>Contador de flejado integrado</p>\n          </li>\n        </ul>\n        <h2 className="text-textGray font-bold text-xl mt-10">Adecuado para</h2>\n        <p>\n          Fleje de poliéster (PET) liso y ondulado FROMM STARstrap TM Fleje de\n          polipropileno (PP)\n        </p>\n        <ul className="flex flex-col gap-5 my-5">\n          <li className="flex gap-2 items-center">\n            <img src="/icons/checkList.svg" />\n            <p>Anchos 10 – 16 mm</p>\n          </li>\n          <li className="flex gap-2 items-center">\n            <img src="/icons/checkList.svg" />\n            <p>Espesores 0,40 – 1,05 mm</p>\n          </li>\n        </ul>\n        <h2 className="text-textGray font-bold text-xl mt-10">Adentro</h2>\n        <p className="my-3">\n          El interior de los nuevos equipos FROMM contiene innovaciones\n          prácticas. Por ejemplo, los motores son sin escobillas y están\n          equipados con protección contra sobrecargas, lo que significa que\n          estos dispositivos requieren menos mantenimiento y ofrecen una vida\n          útil más larga. Un contador de flejes integrado permite leer el número\n          de flejes realizados con un lector disponible opcionalmente.\n        </p>\n        <h2 className="text-textGray font-bold text-xl mt-10">Diseño</h2>\n        <p className="my-3">\n          Con la reconocida fiabilidad suiza, hemos realizado modificaciones en\n          la carcasa. Como resultado, el equipo no solo es más cómodo de usar,\n          sino que también se ha mejorado aún más la resistencia a las caídas.\n          FROMM también ha tenido en cuenta expresamente el trabajo en entornos\n          de trabajo húmedos y polvorientos.\n        </p>\n        <h2 className="text-textGray font-bold text-xl mt-10">\n          Trabaje con menos peso, incluso en paquetes grandes, pequeños y\n          redondos.\n        </h2>\n        <p className="my-3">\n          Para facilitar su uso, FROMM ha mejorado su equipamiento con nuevas\n          técnicas y ha trabajado de forma eficaz en el diseño de la placa base.\n          Ahora se necesita menos fuerza para retirar el dispositivo de debajo\n          del fleje tensado. Esto también se aplica al flejado de paquetes\n          pequeños y redondos. En la mayoría de los casos de flejado\n          imaginables, el fleje permanece intacto.\n        </p>',
      downloads: [
        {
          name: 'Ficha Técnica',
          link: 'https://fromm.com.mx',
        },
        {
          name: 'Manual de Usuario',
          link: 'https://fromm.com.mx',
        },
        {
          name: 'Certificado de Calidad',
          link: 'https://fromm.com.mx',
        },
      ],
      videos: [
        'https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/s-series.mp4',
      ],
    },
  },
];
