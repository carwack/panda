import { describe, expect, test } from 'vitest'
import { parseAndExtract } from './fixture'

describe('config.importMap', () => {
  test('nested outdir + tsconfig.compilerOptions.baseUrl importMap behaviour', () => {
    const code = `
        import { css } from "../styled-system/css";
        import { container } from "../styled-system/patterns";

        export default function App() {
          return (
            <div
              className={container({
                page: "A4",
                width: {
                  _print: "210mm",
                },
                height: {
                  _print: "297mm",
                  base: "600px",
                },
                display: "flex",
                margin: "auto",
                flexDir: {
                  _print: "row",
                  base: "column",
                  sm: "row",
                },
              })}
            >
              <div className={css({ flex: 2 })}>aaa</div>
              <div className={css({ flex: 1 })}>bbb</div>
            </div>
          );
        }

         `
    const result = parseAndExtract(
      code,
      { outdir: 'src/styled-system', cwd: 'app', importMap: 'styled-system' },
      { compilerOptions: { baseUrl: 'app/src' } },
    )

    expect(result.json).toMatchInlineSnapshot(`
      [
        {
          "data": [
            {
              "display": "flex",
              "flexDir": {
                "_print": "row",
                "base": "column",
                "sm": "row",
              },
              "height": {
                "_print": "297mm",
                "base": "600px",
              },
              "margin": "auto",
              "page": "A4",
              "width": {
                "_print": "210mm",
              },
            },
          ],
          "name": "container",
          "type": "pattern",
        },
        {
          "data": [
            {
              "flex": 2,
            },
          ],
          "name": "css",
          "type": "css",
        },
        {
          "data": [
            {
              "flex": 1,
            },
          ],
          "name": "css",
          "type": "css",
        },
      ]
    `)

    expect(result.css).toMatchInlineSnapshot(`
      "@layer utilities {
        .pos_relative {
          position: relative;
      }

        .max-w_8xl {
          max-width: var(--sizes-8xl);
      }

        .mx_auto {
          margin-inline: auto;
      }

        .px_4 {
          padding-inline: var(--spacing-4);
      }

        .page_A4 {
          page: A4;
      }

        .h_600px {
          height: 600px;
      }

        .d_flex {
          display: flex;
      }

        .m_auto {
          margin: auto;
      }

        .flex_2 {
          flex: 2;
      }

        .flex_1 {
          flex: 1 1 0%;
      }

        .flex_column {
          flex-direction: column;
      }

        @media screen and (min-width: 40rem) {
          .sm\\:flex_row {
            flex-direction: row;
      }
      }

        @media screen and (min-width: 48rem) {
          .md\\:px_6 {
            padding-inline: var(--spacing-6);
      }
      }

        @media screen and (min-width: 64rem) {
          .lg\\:px_8 {
            padding-inline: var(--spacing-8);
      }
      }

        @media print {
          .print\\:w_210mm {
            width: 210mm;
      }
          .print\\:h_297mm {
            height: 297mm;
      }
          .print\\:flex_row {
            flex-direction: row;
      }
      }
      }"
    `)
  })
})
