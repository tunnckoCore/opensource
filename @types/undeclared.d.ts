declare module 'espree';
declare module 'acorn-loose';
declare module 'for-in';
declare module 'define-property' {
  export default function(obj: any, name: string, value: any): void;
}
