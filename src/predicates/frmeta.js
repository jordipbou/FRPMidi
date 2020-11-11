import { seemsMessage } from './predicates.js'
import { seemsMetaEvent } from './meta.js'
import { 
  SEQUENCE_EVENT, TIMING_EVENT, TIME_DIVISION_EVENT,
  BAR_EVENT, BEAT_EVENT, SUBDIVISION_EVENT, REST_EVENT
} from '../messages/frmeta.js'
import { allPass, anyPass, curry, is, has, propEq } from 'ramda'

// -------------------- frMIDI Meta Events predicates --------------------

export const seemsfrMetaEvent = (msg) =>
  allPass ([is (Object),
            propEq ('type', 'frmetaevent'),
            has ('metaType'),
            has ('data')])
          (msg)

// ---------------------- frMIDI Message predicates ----------------------

export const seemsfrMessage = (msg) =>
  anyPass 
    ([ seemsMessage, seemsMetaEvent, seemsfrMetaEvent ])
    (msg)

// ------------------- frMIDI Meta Events definitions --------------------

export const frMetaTypeEq = curry ((type, msg) =>
  seemsfrMetaEvent (msg) ?
    propEq ('metaType') (type) (msg)
    : false)

export const isTimingEvent = (msg) =>
  frMetaTypeEq (TIMING_EVENT) (msg)

export const isTimeDivisionEvent = (msg) =>
  frMetaTypeEq (TIME_DIVISION_EVENT) (msg)

export const isSequenceEvent = (msg) =>
  frMetaTypeEq (SEQUENCE_EVENT) (msg)

export const isBarEvent = (msg) =>
  frMetaTypeEq (BAR_EVENT) (msg)

export const isBeatEvent = (msg) =>
  frMetaTypeEq (BEAT_EVENT) (msg)

export const isSubdivisionEvent = (msg) =>
  frMetaTypeEq (SUBDIVISION_EVENT) (msg)

export const isRestEvent = (msg) =>
  frMetaTypeEq (REST_EVENT) (msg)
