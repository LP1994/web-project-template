/** @public */
export class BSONError
  extends Error {
  constructor( message?: string ){
    super( message );
    Object.setPrototypeOf( this, BSONError.prototype );
  }

  override get name(): string{
    return 'BSONError';
  }
}

/** @public */
export class BSONTypeError
  extends TypeError {
  constructor( message?: string ){
    super( message );
    Object.setPrototypeOf( this, BSONTypeError.prototype );
  }

  override get name(): string{
    return 'BSONTypeError';
  }
}
