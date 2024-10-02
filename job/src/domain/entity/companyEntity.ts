class CompanyEntity {
    private readonly _id: string;
    private _name: string;
    private _owner: string;
    private _location: string;
  
    constructor(id: string, name: string, owner: string, location: string) {
      this._id = id;
      this._name = name;
      this._owner = owner;
      this._location = location;
    }
  
    get id(): string {
      return this._id;
    }
  
    get name(): string {
      return this._name;
    }
  
    get owner(): string {
      return this._owner;
    }
  
    get location(): string {
      return this._location;
    }
  
    set name(name: string) {
      this._name = name;
    }
  
    set owner(owner: string) {
      this._owner = owner;
    }
  
    set location(location: string) {
      this._location = location;
    }
  }
  
  export { CompanyEntity };