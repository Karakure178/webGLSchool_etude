//processingのmap関数を再現する
//値,値の本来の範囲,変更後の範囲
//変更後の範囲に見合った値が返却される
export function map(value, start1, stop1, start2, stop2) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}
