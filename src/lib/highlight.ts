// Lightweight, dependency-free syntax highlighter for PHP/SQL/HTML snippets.
// Returns an array of tokens that the CodeBlock component renders as spans.
// Not a full tokenizer — tuned for the kind of short snippets in the quiz.

export type TokenType =
  | 'kw'
  | 'str'
  | 'com'
  | 'num'
  | 'fn'
  | 'var'
  | 'op'
  | 'attr'
  | 'tag'
  | 'const'
  | 'type'
  | 'plain';

export interface Token {
  type: TokenType;
  value: string;
}

const PHP_KEYWORDS = new Set([
  'class', 'function', 'return', 'public', 'private', 'protected', 'static',
  'final', 'readonly', 'const', 'new', 'extends', 'implements', 'interface',
  'abstract', 'namespace', 'use', 'if', 'else', 'elseif', 'foreach', 'for',
  'while', 'do', 'switch', 'case', 'break', 'continue', 'throw', 'try',
  'catch', 'finally', 'enum', 'match', 'fn', 'yield', 'echo', 'print',
  'require', 'require_once', 'include', 'include_once', 'isset', 'unset',
  'instanceof', 'as', 'clone', 'parent', 'self', 'void', 'never',
]);

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'BEGIN',
  'COMMIT', 'ROLLBACK', 'ISOLATION', 'LEVEL', 'REPEATABLE', 'READ', 'COMMITTED',
  'UNCOMMITTED', 'SERIALIZABLE', 'CREATE', 'INDEX', 'TABLE', 'USING', 'GIN',
  'BRIN', 'BTREE', 'HASH', 'EXPLAIN', 'ANALYZE', 'JOIN', 'LEFT', 'RIGHT',
  'INNER', 'OUTER', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET',
  'AND', 'OR', 'NOT', 'NULL', 'TRUE', 'FALSE', 'DEFAULT', 'PRIMARY', 'KEY',
  'REFERENCES', 'ON', 'CONFLICT', 'VALUES',
]);

const PHP_CONSTS = new Set([
  'true', 'false', 'null', 'TRUE', 'FALSE', 'NULL',
]);

function detectLanguage(snippet: string): 'php' | 'sql' | 'html' {
  const s = snippet.trim();
  if (/^(SELECT|INSERT|UPDATE|DELETE|BEGIN|CREATE|EXPLAIN)\b/i.test(s)) return 'sql';
  if (/^<\w|<\/\w|<!doctype|<html/i.test(s)) return 'html';
  if (/^(class|function|public|private|protected|final|abstract|namespace|use|\$|require|echo|return|\w+::)/i.test(s)) return 'php';
  if (/\$\w+/.test(s) || /->|::/.test(s)) return 'php';
  return 'php';
}

export function tokenize(snippet: string): Token[] {
  const lang = detectLanguage(snippet);
  const tokens: Token[] = [];
  let i = 0;
  const n = snippet.length;

  const pushPlain = (text: string) => {
    if (text) tokens.push({ type: 'plain', value: text });
  };

  while (i < n) {
    const ch = snippet[i];
    const rest = snippet.slice(i);

    // Line comment // or #
    if (lang === 'php' && (rest.startsWith('//') || ch === '#')) {
      const end = snippet.indexOf('\n', i);
      const stop = end === -1 ? n : end;
      tokens.push({ type: 'com', value: snippet.slice(i, stop) });
      i = stop;
      continue;
    }
    // SQL line comment --
    if (lang === 'sql' && rest.startsWith('--')) {
      const end = snippet.indexOf('\n', i);
      const stop = end === -1 ? n : end;
      tokens.push({ type: 'com', value: snippet.slice(i, stop) });
      i = stop;
      continue;
    }
    // Block comment /* */
    if (rest.startsWith('/*')) {
      const end = snippet.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      tokens.push({ type: 'com', value: snippet.slice(i, stop) });
      i = stop;
      continue;
    }
    // HTML comment <!-- -->
    if (lang === 'html' && rest.startsWith('<!--')) {
      const end = snippet.indexOf('-->', i + 4);
      const stop = end === -1 ? n : end + 3;
      tokens.push({ type: 'com', value: snippet.slice(i, stop) });
      i = stop;
      continue;
    }
    // Strings: single, double, backtick
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      let j = i + 1;
      while (j < n && snippet[j] !== quote) {
        if (snippet[j] === '\\') j += 2;
        else j++;
      }
      j = Math.min(j + 1, n);
      tokens.push({ type: 'str', value: snippet.slice(i, j) });
      i = j;
      continue;
    }
    // PHP attribute #[...]
    if (lang === 'php' && rest.startsWith('#[')) {
      const end = snippet.indexOf(']', i + 2);
      const stop = end === -1 ? n : end + 1;
      tokens.push({ type: 'attr', value: snippet.slice(i, stop) });
      i = stop;
      continue;
    }
    // PHP variable $name
    if (lang === 'php' && ch === '$') {
      let j = i + 1;
      while (j < n && /[\w]/.test(snippet[j])) j++;
      tokens.push({ type: 'var', value: snippet.slice(i, j) });
      i = j;
      continue;
    }
    // HTML tag < ... >
    if (lang === 'html' && (ch === '<')) {
      const end = snippet.indexOf('>', i);
      const stop = end === -1 ? n : end + 1;
      const tagText = snippet.slice(i, stop);
      // split into tag name + attributes roughly
      tokens.push({ type: 'tag', value: tagText });
      i = stop;
      continue;
    }
    // Numbers
    if (/[0-9]/.test(ch) && (i === 0 || /[^a-zA-Z0-9_]/.test(snippet[i - 1]))) {
      let j = i;
      while (j < n && /[0-9_.]/.test(snippet[j])) j++;
      tokens.push({ type: 'num', value: snippet.slice(i, j) });
      i = j;
      continue;
    }
    // Identifier
    if (/[a-zA-Z_\\]/.test(ch)) {
      let j = i;
      while (j < n && /[\w\\]/.test(snippet[j])) j++;
      const word = snippet.slice(i, j);
      const nextNonSpace = snippet.slice(j).match(/^\s*(.)/);
      const nextCh = nextNonSpace ? nextNonSpace[1] : '';

      if (lang === 'sql' && SQL_KEYWORDS.has(word.toUpperCase())) {
        tokens.push({ type: 'kw', value: word });
      } else if (lang === 'php' && PHP_KEYWORDS.has(word)) {
        tokens.push({ type: 'kw', value: word });
      } else if (lang === 'php' && PHP_CONSTS.has(word)) {
        tokens.push({ type: 'const', value: word });
      } else if (nextCh === '(') {
        tokens.push({ type: 'fn', value: word });
      } else if (/^[A-Z]/.test(word) && word.length > 1) {
        tokens.push({ type: 'type', value: word });
      } else {
        pushPlain(word);
      }
      i = j;
      continue;
    }
    // Operators / punctuation
    if (/[=+\-*/%<>!&|?:.,;()\[\]{}@]/.test(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    // Whitespace / other
    tokens.push({ type: 'plain', value: ch });
    i++;
  }

  return tokens;
}

export const TOKEN_CLASS: Record<TokenType, string> = {
  kw: 'tok-kw',
  str: 'tok-str',
  com: 'tok-com',
  num: 'tok-num',
  fn: 'tok-fn',
  var: 'tok-var',
  op: 'tok-op',
  attr: 'tok-attr',
  tag: 'tok-tag',
  const: 'tok-const',
  type: 'tok-type',
  plain: '',
};
