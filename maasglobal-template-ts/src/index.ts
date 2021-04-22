import * as P from 'maasglobal-prelude-ts';

import * as t from 'io-ts';
import { Errors, validator } from 'io-ts-validator';
// eslint-disable-next-line no-restricted-imports
import * as ruins from 'ruins-ts';

// OO library mockup
// eslint-disable-next-line fp/no-class
class SmsLibrary {
  async sendSMS(phone: string, message: string): Promise<void> {
    console.log(`sending to ${phone}: ${message}`);
  }
}

// Phone number type
export type PhoneBrand = {
  readonly Phone: unique symbol;
};
export const Phone = t.brand(
  t.string,
  (s): s is t.Branded<string, PhoneBrand> =>
    s.match(RegExp('^\\+(?:\\d){6,14}\\d$')) !== null,
  'Phone',
);
export type Phone = t.TypeOf<typeof Phone>;

// Sms message type
export type SmsBrand = {
  readonly Sms: unique symbol;
};
export const Sms = t.brand(
  t.string,
  (s): s is t.Branded<string, SmsBrand> => s.length <= 160,
  'Sms',
);
export type Sms = t.TypeOf<typeof Sms>;

// Error type
export const Err = t.type({
  reason: t.string,
  debug: t.unknown,
});
export type Err = t.TypeOf<typeof Err>;

// Error constructor
export function err(reason: string, debug?: unknown): Err {
  return {
    reason,
    debug,
  };
}

// FP wrapper for OO library
function fpSendValidSms(phone: Phone): (m: Sms) => P.TaskEither<Err, void> {
  return (message) =>
    P.TaskEither_.tryCatch(
      async () => {
        const ooLibrary = new SmsLibrary();
        return ooLibrary.sendSMS(phone, message);
      },
      (error): Err => err('library call failure', { error }),
    );
}

// FP input validator
type Inputs = {
  phone: Phone;
  message: Sms;
};
type RawInputs = {
  phone: string;
  message: string;
};
function inputs({ phone, message }: RawInputs): P.Either<Err, Inputs> {
  return P.pipe(
    {
      phone: validator(Phone, 'strict').decodeEither(phone),
      message: validator(Sms, 'strict').decodeEither(message),
    },
    P.Apply_.sequenceS(P.Either_.Apply),
    P.Either_.mapLeft(
      (errors: Errors): Err => ({
        reason: 'input validation failure',
        debug: { errors },
      }),
    ),
  );
}

// FP implementation
export function fpSendSms(rawPhone: string): (m: string) => P.TaskEither<Err, void> {
  return (rawMessage) =>
    P.pipe(
      P.Task_.of(inputs({ phone: rawPhone, message: rawMessage })),
      P.TaskEither_.chain(({ phone, message }) => P.pipe(message, fpSendValidSms(phone))),
    );
}

// OO shim
export function ooSendSms(phone: string, message: string): Promise<void> {
  const main = P.pipe(message, fpSendSms(phone));
  return ruins.fromTaskEither(main);
}
