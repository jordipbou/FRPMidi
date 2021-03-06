const test = require ('ava')
import { recordToTrack, recorder } from '../../src/sequences/recorder.js'
import { createSequence } from '../../src/sequences/sequences.js'
import { mc, off, on } from '../../src/messages/messages.js'
import { sequenceEvent } from '../../src/messages/frmeta.js'
import { setup_scheduler } from './sequences.js'
import { deltaTime } from '../../src/lenses/lenses.js'
import { set } from 'ramda'

test ('recordToTrack', (t) => {
  t.deepEqual (
    recordToTrack (0) (createSequence ([], 1)) (on (64)),
    createSequence ([set (deltaTime) (0) (on (64))], 1))
})

test ('recorder', (t) => {
  const scheduler = setup_scheduler (t)

  scheduler.run (({ cold, expectObservable }) => {
    const source = cold (
      '               a---b---cd---ef',
      {
        a: on (64),
        b: on (67),
        c: mc (1),
        d: off (67),
        e: mc (2),
        f: off (64)
      })

    const expected = '(az)(by)c(dx)e(fw)'
    const values = {
      a: on (64),
      z: sequenceEvent (
           createSequence ([
             set (deltaTime) (0) (on (64))
           ], 1)),
      b: on (67),
      y: sequenceEvent (
           createSequence ([
             set (deltaTime) (0) (on (64)), 
             set (deltaTime) (0) (on (67))
           ]) (1)),
      c: mc (1),
      d: off (67),
      x: sequenceEvent (
           createSequence ([
             set (deltaTime) (0) (on (64)),
             set (deltaTime) (0) (on (67)),
             set (deltaTime) (1) (off (67, 96))
          ]) (1)),
      e: mc (2),
      f: off (64),
      w: sequenceEvent (
           createSequence ([
             set (deltaTime) (0) (on (64)),
             set (deltaTime) (0) (on (67)),
             set (deltaTime) (1) (off (67, 96)),
             set (deltaTime) (2) (off (64, 96))
          ]) (1))
    }

    expectObservable (
      source.pipe (recorder (1, false))
    ).toBe (expected, values)
  })
})
