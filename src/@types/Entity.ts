export interface UniqueEntity<TId extends keyof any = number | string> {
  id: TId
}
