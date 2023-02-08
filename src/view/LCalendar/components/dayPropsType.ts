import {
  CalendarEvent,
  IMonthMouseTime, IMouseEvent, IMouseTime
} from '../utils/calendar'
import React from 'react'
import { ISlots } from './type'



interface IHandleEvent<E, T> {
  onClickEvent:(e:E)=>E
  onMousedownEvent:(e: E) => E
  onMouseupEvent:(e: E) => E

  onTimeContainerClick: (time:T) => T
  onTimeContainerMouseup: (time:T) => T
  onTimeContainerMousemove: (time:T) => T
  onTimeContainerMousedown: (time:T) => T
}



export interface IDayProps extends IHandleEvent<IMouseEvent, IMouseTime>{
  firstTime?: number|string|object
}

export interface IMonthProps  extends IHandleEvent<IMouseEvent, IMonthMouseTime> {
  onShowMore:(arg:ISlots) => void
}


