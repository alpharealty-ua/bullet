type Prettify<T> = {
  [P in keyof T]: T[P]
} & {}
