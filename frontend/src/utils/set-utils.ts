export function setUnion<T>(...sets: Set<T>[]) {
  const newSet = new Set<T>();
  sets.forEach((set) => set.forEach((value) => newSet.add(value)));
  return newSet;
}

export function setAdd<T>(set: Set<T>, value: T) {
  const newSet = new Set(set);
  newSet.add(value);
  return newSet;
}

export function setDelete<T>(set: Set<T>, value: T) {
  const newSet = new Set(set);
  newSet.delete(value);
  return newSet;
}

export function setDifference<T>(setA: Set<T>, setB: Set<T>) {
  const newSet = new Set(setA);
  setB.forEach((value) => newSet.delete(value));
  return newSet;
}
