export class State<T> {
  current: T

  constructor(initialValue: T) {
    this.current = $state(initialValue)
  }
}