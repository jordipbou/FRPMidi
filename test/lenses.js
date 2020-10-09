const test = require ('ava')
import { add, gt, lt, view, set, over } from 'ramda'
import { 
  cc, cp, mc, off, on, pb, pp, tempoChange
} from '../src/messages'
import { 
  channel, control, deltaTime, lensP, note, 
  pitchBend, pressure, timeStamp, tempo, velocity
} from '../src/lenses/lenses.js'

// TODO: Test getByte, setByte and lensWhen

test ('timeStamp lens', (t) => {
  t.is (view (timeStamp) (on (64)), 0)
  t.is (view (timeStamp) ([144, 64, 96]), undefined)

  t.is ((set (timeStamp) (100) (on (64))).timeStamp, 100)
  t.deepEqual (set (timeStamp) (100) ([144, 64, 96]), [144, 64, 96])

  t.is ((over (timeStamp) (add (3)) (on (64))).timeStamp, 3)
})

test ('deltaTime lens', (t) => {
  t.is (view (deltaTime) (on (64)), 0)
  t.is (view (deltaTime) ([144, 64, 96]), undefined)

  t.is ((set (deltaTime) (100) (on (64))).deltaTime, 100)
  t.deepEqual (set (deltaTime) (100) ([144, 64, 96]), [144, 64, 96])

  t.is ((over (deltaTime) (add (3)) (on (64))).deltaTime, 3)
})

test ('channel lens', (t) => {
  t.is (view (channel) (off (64)), 0)
  t.is (view (channel) (on (64, 96, 1)), 1)
  t.is (view (channel) (mc ()), undefined)

  t.deepEqual (set (channel) (3) (off (64)), off (64, 96, 3))

  t.deepEqual (over (channel) (add (1)) (off (64)), off (64, 96, 1))
})

test ('note lens', (t) => {
  t.is (view (note) (off (64)), 64)
  t.is (view (note) (pp (64)), 64)
  t.is (view (note) (cc (32, 18)), undefined)

  t.deepEqual (set (note) (50) (off (64)), off (50))
  t.deepEqual (set (note) (50) (pp (64)), pp (50))
  t.deepEqual (set (note) (50) (cc (32, 18)), cc (32, 18))

  t.deepEqual (over (note) (add (3)) (off (64)), off (67))
  t.deepEqual (over (note) (add (-3)) (pp (64)), pp (61))
  t.deepEqual (over (note) (add (3)) (cc (32, 18)), cc (32, 18))
})

test ('velocity lens', (t) => {
  t.is (view (velocity) (off (64, 96)), 96)
  t.is (view (velocity) (pp (64, 96)), undefined)

  t.deepEqual (set (velocity) (127) (off (64, 96)), off (64, 127))
  t.deepEqual (set (velocity) (127) (pp (64, 96)), pp (64, 96))

  t.deepEqual 
    (over (velocity) (add (3)) (off (64, 96)), off (64, 99))
  t.deepEqual
    (over (velocity) (add (3)) (pp (64, 96)), pp (64, 96))
})

test ('pressure lens', (t) => {
  t.is (view (pressure) (pp (64, 96)), 96)
  t.is (view (pressure) (on (64, 96)), undefined)

  t.deepEqual (set (pressure) (127) (pp (64, 96)), pp (64, 127))
  t.deepEqual (set (pressure) (127) (on (64, 96)), on (64, 96))

  t.deepEqual (over (pressure) (add (3)) (pp (64, 96)), pp (64, 99))
  t.deepEqual (over (pressure) (add (3)) (on (64, 96)), on (64, 96))
})

test ('control lens', (t) => {
  t.is (view (control) (cc (32, 18)), 32)
  t.is (view (control) (on (64)), undefined)

  t.deepEqual (set (control) (127) (cc (32, 18)), cc (127, 18))
  t.deepEqual (set (control) (127) (on (64)), on (64))

  t.deepEqual (over (control) (add (3)) (cc (32, 18)), cc (35, 18))
  t.deepEqual (over (control) (add (3)) (on (64)), on (64))
})

test ('pitch bend lens', (t) => {
  t.is (view (pitchBend) (pb (3520)), 3520)
  t.is (view (pitchBend) (on (64)), undefined)
})

test ('lens predicates', (t) => {
  t.true (lensP (velocity, gt, 64) (on (54, 96)))
  t.true (lensP (velocity, lt, 100) (on (54, 96)))
  t.false (lensP (velocity, lt, 64) (on (54, 96)))
})

test ('tempo change message: tempo lens', (t) => {
  t.is (view (tempo) (tempoChange (59800)), 59800)
  t.is (view (tempo) (on (64)), undefined)

  t.deepEqual (set (tempo) (32000) (tempoChange (59800)),
               tempoChange (32000))
  t.deepEqual (set (tempo) (32000) (on (64)), on (64))

  t.deepEqual (over (tempo) (add (200)) (tempoChange (59800)),
               tempoChange (60000))
  t.deepEqual (over (tempo) (add (200)) (on (64)), on (64))
})
