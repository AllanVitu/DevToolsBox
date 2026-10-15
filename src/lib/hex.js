// Texte ⇄ hexadécimal (octets UTF-8).

export function textToHex(text, separator = ' ', uppercase = false) {
  const hex = Array.from(new TextEncoder().encode(text), (b) => b.toString(16).padStart(2, '0'));
  const out = hex.join(separator);
  return uppercase ? out.toUpperCase() : out;
}

export function hexToText(hex) {
  const clean = hex.replace(/0x/gi, '').replace(/\\x/gi, '').replace(/[^0-9a-f]/gi, '');
  if (clean.length % 2 !== 0) throw new Error('nombre de chiffres hexadécimaux impair');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function convertHex(input, mode, { separator = ' ', uppercase = false } = {}) {
  if (!input) return { text: '', error: '' };
  try {
    return { text: mode === 'text2hex' ? textToHex(input, separator, uppercase) : hexToText(input), error: '' };
  } catch (e) {
    const reason = e instanceof TypeError ? 'ces octets ne forment pas du texte UTF-8 valide' : e.message;
    return { text: '', error: `Conversion impossible : ${reason}.` };
  }
}
