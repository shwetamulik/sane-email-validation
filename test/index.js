/* eslint-env mocha */
/* eslint-disable indent, no-trailing-spaces */
const assert = require('assert')
const isAsciiEmail = require('../index').isAsciiEmail
const isEmail = require('../index')
const isNotAsciiEmail = require('../index').isNotAsciiEmail
const isNotEmail = require('../index').isNotEmail

describe('isEmail', () => {
  it('empty', () => {
    assert.strictEqual(isEmail(''), false, 'Empty email should not be valid.')
  })

  it('invalid', () => {
    const longLabel = new Array(65).join('a')
    
    assert.strictEqual(isEmail('debt'), false,
    'Cannot be local only.')
    assert.strictEqual(isEmail('@example.com'), false,
    'Cannot be domain only.')
    assert.strictEqual(isEmail('debt@example'), false,
    'Cannot have a domain with only one label.')
    assert.strictEqual(isEmail('debt@-example.com'), false,
    'Cannot start domain with a hyphen.')
    assert.strictEqual(isEmail('debt@example-.com'), false,
    'Cannot end domain with a hyphen.')
    assert.strictEqual(isEmail('debt@example!com'), false, 
    'Cannot contain special characters in domain.')
    assert.strictEqual(isEmail('debt@' + longLabel + '.com'), false,
    'Cannot contain domain label >63 characters.')
    assert.strictEqual(isEmail('debt.@example.com'), false,
    'Cannot end local part with a dot.')
  })

  it('valid', () => {
    const longLabel = new Array(64).join('a')

    assert.strictEqual(isEmail(longLabel + longLabel + '@example.com'), true,
    'Should accept very long local address.')
    assert.strictEqual(isEmail('debt@' + longLabel + '.com'), true,
    'Should accept 63 character domain labels.')
    assert.strictEqual(isEmail(".!#$%&'*+/=?^_`{|}~-a9@example.com"), true,
    'Should accept special characters in local address.')
    assert.strictEqual(isEmail('👋@example.com'), true,
    'Should accept unicode in local address')
    assert.strictEqual(isEmail('debt@👋.com'), true,
    'Should accept unicode in domain.')
    assert.strictEqual(isEmail('debt@xn--wp8h.com'), true,
    'Should accept punycoded domains.')
    assert.strictEqual(isEmail('debt@billing.👋.com'), true,
    'Should accept unicode in every domain label.')
  })

  it('should handle complex TLD scenarios', () => {
    const invalidTlds = [
      'example.c',
      'example.corporate',
      'example.com-uk',
      'example.123',
      'example.com.co.uk',
      'example.domain-with-multiple-dashes.tld',
      'example@subdomain.with.very.long.domain.part@longtld'
    ]

    invalidTlds.forEach(tld => {
      assert.strictEqual(isEmail(`user@${tld}`), false, `Invalid TLD: ${tld}`)
    })
  })
})

describe('isAsciiEmail', () => {
  it('empty', () => {
    assert.strictEqual(isAsciiEmail(''), false, 'Empty ASCII email should not be valid.')
  })

  it('should reject invalid ASCII email formats', () => {
    const longLabel = new Array(65).join('a')

    assert.strictEqual(isAsciiEmail('debt'), false,
    'Cannot be local only.')
    assert.strictEqual(isAsciiEmail('@example.com'), false,
    'Cannot be domain only.')
    assert.strictEqual(isAsciiEmail('debt@example'), false,
    'Cannot have a domain with only one label.')
    assert.strictEqual(isAsciiEmail('debt@-example.com'), false,
    'Cannot start domain with a hyphen.')
    assert.strictEqual(isAsciiEmail('debt@example-.com'), false,
    'Cannot end domain with a hyphen.')
    assert.strictEqual(isAsciiEmail('debt@example!com'), false,
    'Cannot contain special characters in domain.')
    assert.strictEqual(isAsciiEmail('debt@' + longLabel + '.com'), false, 'Cannot contain domain label >63 characters.')
    assert.strictEqual(isAsciiEmail('debt.@example.com'), false,
    'Cannot end name with dot.')
  })

  it('should reject unicode in ASCII email', () => {
    assert.strictEqual(isAsciiEmail('👋@example.com'), false, 'Should not accept unicode in local address.')
    assert.strictEqual(isAsciiEmail('debt@👋.com'), false, 'Should not accept unicode in domain.')
  })

  it('should accept valid ASCII emails', () => {
    const longLabel = new Array(64).join('a')

    assert.strictEqual(isAsciiEmail(longLabel + longLabel + '@example.com'), true,
    'Should accept very long local address.')
    assert.strictEqual(isAsciiEmail('debt@' + longLabel + '.com'), true,
    'Should accept 63 character domain labels.')
    assert.strictEqual(isAsciiEmail(".!#$%&'*+/=?^_`{|}~-a9@example.com"), true,
    'Should accept certain special characters in local address.')
  })
})

describe('isNotEmail', () => {
  it('empty', () => {
    assert.strictEqual(isNotEmail(''), true, 'Empty email should be considered invalid.')
  })

  it('should identify invalid email formats', () => {
    const longLabel = new Array(65).join('a')

    assert.strictEqual(isNotEmail('debt'), true, 'Should be invalid: local only.')
    assert.strictEqual(isNotEmail('@example.com'), true, 'Should be invalid: domain only.')
    assert.strictEqual(isNotEmail('debt@example'), true, 'Should be invalid: single domain label.')
    assert.strictEqual(isNotEmail('debt.@example.com'), true, 'Should be invalid: ends with dot.')
  })
})

describe('isNotAsciiEmail', () => {
  it('should reject empty email', () => {
    assert.strictEqual(isNotAsciiEmail(''), true, 'Empty email should be considered invalid.')
  })

  it('should correctly identify invalid ASCII email formats', () => {
    assert.strictEqual(isNotAsciiEmail('👋@example.com'), true, 'Should be invalid: unicode in local part.')
    assert.strictEqual(isNotAsciiEmail('debt@👋.com'), true, 'Should be invalid: unicode in domain.')
    assert.strictEqual(isNotAsciiEmail('debt@xn--wp8h.com'), true, 'Cannot contain punycoded domains')
  })

  it('should accept valid ASCII emails', () => {
    const longLabel = new Array(64).join('a')

    assert.strictEqual(isNotAsciiEmail(longLabel + longLabel + '@example.com'), false, 'Should be valid: long address.')
    assert.strictEqual(isNotAsciiEmail('debt@' + longLabel + '.com'), false, 'Should be valid: 63-character domain.')
  })
})

