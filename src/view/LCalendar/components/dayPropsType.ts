import {
  CalendarEvent, CalendarTimestamp, IMouseEvent, IMouseTime, IValue, VTimestampInput
} from '../utils/calendar'
import React from 'react'

export interface ICalendar {
  type: string
  value: IValue
}
export interface ITimes {
  now:CalendarTimestamp | null
  today: CalendarTimestamp | null
}
export interface  IBase{
  parsedStart: CalendarTimestamp
  parsedEnd: CalendarTimestamp
  weekdays: number[] | string
  times: ITimes
}

export type IEvents = CalendarEvent[]

export interface IIntervals {
  maxDays: number
  intervalWidth: number | string
  firstTime?: number|string|object
  firstInterval: number|string
  intervalMinutes: string |number
  intervalCount: number
  intervalHeight: number
}

export interface IEvent {
  eventStart : string,
  eventEnd : string,
  eventTimed : string,
  eventOverlapMode: string
  eventOverlapThreshold: number|string
}

export interface IMonthMouseTime extends CalendarTimestamp{
  nativeEvent: React.MouseEvent
}
export interface IMonthHandleEvent {
  onMonthTimeContainerMousedown: (time:IMonthMouseTime) => void
  onMonthTimeContainerMouseup: () => void
  onMonthTimeContainerMousemove: (time:IMonthMouseTime) => void
}
export interface IHandleEvent {
  onTimeHeaderClick: (e:React.MouseEvent, event:CalendarTimestamp) => any
  onMousedownEvent:(event: IMouseEvent) => void
  onContextMenuEvent: (event: IMouseEvent) => void
  onTimeContainerMouseup: (time:IMouseTime) => void
  onTimeContainerMousemove: (time:IMouseTime) => void
  onTimeContainerMousedown: (time:IMouseTime) => void
}

export interface IDayProps extends IIntervals, IHandleEvent{
  events: IEvents
}

