export interface UpdateMapPropSync<T> {
  (map: T): T;
}

export interface UpdateMapProp<T> {
  (map: T): Promise<T>;
}
