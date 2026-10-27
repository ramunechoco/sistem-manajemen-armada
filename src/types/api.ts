export interface ResourceIdentifier<Type extends string = string> {
  id: string
  type: Type
}

export interface Relationship<
  Data extends ResourceIdentifier | ResourceIdentifier[] | null = ResourceIdentifier | null,
> {
  data: Data
}

export interface JsonApiResource<
  Type extends string = string,
  Attributes extends object = Record<string, unknown>,
  Relationships extends object = Record<string, Relationship>,
> {
  id: string
  type: Type
  attributes: Attributes
  relationships?: Relationships
  links?: { self?: string }
}

export type AnyResource = JsonApiResource<string, object, object>

export interface Links {
  self?: string
  first?: string
  prev?: string
  next?: string
  last?: string
}

export interface JsonApiCollection<T extends AnyResource> {
  data: T[]
  included?: AnyResource[]
  links?: Links
}

export interface JsonApiDocument<T extends AnyResource> {
  data: T
  included?: AnyResource[]
  links?: Links
}

export interface JsonApiError {
  status?: string
  code?: string
  title?: string
  detail?: string
  source?: { parameter?: string; pointer?: string }
}

export interface JsonApiErrorResponse {
  errors: JsonApiError[]
}
