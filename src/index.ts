import { Plugin } from 'vite'


type ReplacePair = { from: RegExp | string | string[]; to: string | number };
type ReplaceFn = (source: string, path: string) => string;

interface IReplacement {
  id?: string | number;
  filter: RegExp | string | string[];
  replace: ReplacePair | Array<ReplacePair>;
}

interface Options {
  apply?: 'serve' | 'build';
}

function stringToReg(str: string | RegExp | string[]): RegExp {
  return str instanceof RegExp
    ? str
    : new RegExp(
        `(${[]
          .concat(str as any)
          .map(escape)
          .join('|')})`,
        'g',
      );
}

function escape(str: string): string {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function relpacementResolver(
  rep: IReplacement[],
): { id?: string | number; filter: RegExp; replace: ReplaceFn[] }[] {
  if (!rep || !rep.length) return [];

  return rep.reduce((acc: any[], replacement) => {
    let { replace = [], filter } = replacement;

    const _filter = stringToReg(filter);

    if (!_filter) return acc;

    if (!Array.isArray(replace)) {
      replace = [replace];
    }

    const _replace = replace.reduce((acc: ReplaceFn[], rp) => {
      const { from, to } = rp;
      if (!from && !to) return acc;
      return acc.concat((code) => code.replace(stringToReg(from), String(to)));
    }, []);

    if (!_replace.length) return acc;

    return acc.concat({ ...replacement, filter: _filter, replace: _replace });
  }, []);
}

export default function replace(
  replacements: IReplacement[] = [],
  options: Options = { apply: 'build' },
): Plugin {
  const resolvedReplacements = relpacementResolver(replacements);
  if (!resolvedReplacements.length) return {} as any;

  function replace(code: string, id: string): string {
    return resolvedReplacements.reduce((code, rp) => {
      if (!rp.filter.test(id)) {
        return code;
      }
      return rp.replace.reduce((text, replace) => replace(text, id), code);
    }, code);
  }
  return {
    name: 'vite-string-replacement',
    apply: options.apply,
    generateBundle(_, bundle) {
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        if(chunk.type === 'asset') {
          chunk.source = replace(chunk.source as string, fileName);
        }
      });
    },
    transform(code: string, id: string) {
      return replace(code, id);
    },
  };
}
