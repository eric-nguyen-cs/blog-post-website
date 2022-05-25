type LocalItemKey = "email" | "name"
class LocalItem{
  key: LocalItemKey
  public constructor(key: LocalItemKey){
    this.key = key
  }
  get() {
    return localStorage.getItem(this.key)
  }
  set(data: string) {
    localStorage.setItem(this.key, data)
  }
  reset() {
    localStorage.removeItem(this.key)
  }
}

export const LocalEmail = new LocalItem("email")
export const LocalName = new LocalItem("name")