/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
export async function GET({ url }) {
  return new Response(JSON.stringify(process.env, undefined, 2));
}