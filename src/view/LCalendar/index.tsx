import React, {
  useEffect,
  useContext, useRef, useState
} from 'react'
import {
  BaseContext,
  EventContext,
  CalendarContext,
  IntervalsContext,
  MouseEventContext
} from './props/propsContext'
import { CreatePopover } from './Popover/CreatePopover'
import { NormalPopover } from './Popover/NormalPopover'
import {
  DEFAULT_MAX_DAYS,
  DEFAULT_WEEK_DAYS
} from './utils/time'
import {
  IGlobalCache,
  ITimes
} from './props/type'
import {
  CalendarEvent,
  CalendarTimestamp
} from './utils/calendar'
import { SideComponent } from './SideComponent'
import {
  nextDay,
  prevDay,
  DAY_MIN,
  relativeDays,
  DAYS_IN_WEEK,
  getEndOfWeek,
  copyTimestamp,
  updateWeekday,
  getStartOfWeek,
  updateRelative,
  timestampToDate,
  updateFormatted,
  DAYS_IN_MONTH_MAX, getStartOfMonth, getEndOfMonth
} from './utils/timesStamp'
import styles from './style.module.less'
import MenuHeader from './modules/MenuHeader'
import { DayWrapper } from './modules/DayWrapper'
import { MonthWrapper } from './modules/MonthWrapper'
import { IS_FULL_WIDTH, IS_HIGH_LEVEL } from './Popover/helpers'

const globalCache:IGlobalCache = {
  isCreate: false,
  isDragging: false,
  draggingEvent: null,
  dragSource: null,
  currentMousedownRef: null,
  currentMousedownEvent: null,
  currentCreateEvent: null,
}



export default function () {
  const { setEnd,
    setStart,
    weekDays,
    setWeekDays,
    times,
    parsedValue, } = useContext(BaseContext)
  const { events, setEvents, resetEvents, } = useContext(EventContext)
  const { type, value, setValue, setType, } = useContext(CalendarContext)
  const {  setMaxDays, } = useContext(IntervalsContext)
  const { setCreatePopoverRef,
    setShowCreatePopover,
    setShowNormalPopover,
    setNormalPopoverRef,
    setNormalEvent, } = useContext(MouseEventContext)



  const [dragEvent, setDragEvent] = useState<CalendarEvent | null>(null)
  const [createEvent, setCreateEvent] = useState<CalendarEvent | null>(null)
  const [dragTime, setDragTime] = useState<number|null>(null)
  const [mousedownTime, setMousedownTime] = useState<number|null>(null)
  const [mousemoveTime, setMousemoveTime] = useState<number|null>(null)
  const [createStart, setCreateStart] = useState<number| null>(null)




  // 这里的是为了响应type的变化
  // 目前在周视图和日视图中
  // 修改 maxDays 和 weekDays
  useEffect(() => {
    const around = parsedValue as CalendarTimestamp
    let newMaxDays = DEFAULT_MAX_DAYS
    let newWeekdays = DEFAULT_WEEK_DAYS
    switch (type) {
    case 'month':{
      break
    }
    case 'week':{
      break
    }
    case 'day':{
      newMaxDays = 1
      newWeekdays = [around.weekday]
    }
    }
    setMaxDays(newMaxDays)
    setWeekDays(newWeekdays)
  }, [type, parsedValue])

  // 由于move会改变value
  // 所以move会改变 parsedValue
  // value 会改变当前页面的显示日期
  // 这里还会依赖到 maxDays weekDays
  // 当修改type完成后,根据上面两个值渲染新的页面
  useEffect(() => {
    const around = parsedValue as CalendarTimestamp
    let newStart = around.date
    let newEnd = around.date
    switch (type) {
    case 'month':{
      newStart = getStartOfMonth(around).date
      newEnd = getEndOfMonth(around).date
      break
    }
    case 'week':{
      newStart = getStartOfWeek(
        around, weekDays, around
      ).date
      newEnd = getEndOfWeek(
        around, weekDays, around
      ).date
      break
    }
    case 'day':{
      break
    }
    }
    setStart(newStart)
    setEnd(newEnd)
  }, [parsedValue, weekDays, type])
  // 点击下一天，应该提前更新parsedValue


  function move(amount = 1):void {
    const moved = copyTimestamp(parsedValue as CalendarTimestamp)
    const forward = amount > 0
    const mover = forward ? nextDay : prevDay
    const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN
    let newAmount = forward ? amount : -amount
    while ((newAmount -= 1) >= 0) {
      switch (type) {
      case 'month':{
        moved.day = limit
        mover(moved)
        break
      }
      case 'week':{
        relativeDays(
          moved, mover, DAYS_IN_WEEK
        )
        break
      }
      case 'day':{
        relativeDays(
          moved, mover, 1
        )
        break
      }
      }
    }
    // 根据年月日 计算周几
    updateWeekday(moved)
    // 设置 time 和 date
    updateFormatted(moved)
    updateRelative(moved, (times as ITimes).now)
    if (value instanceof Date) {
      setValue(timestampToDate(moved))
    } else if (typeof value === 'number') {
      setValue(timestampToDate(moved)
        .getTime())
    } else {
      setValue(moved.date)
    }
  }

  const setGlobalCacheValue = (key: keyof IGlobalCache, val:any):void => {
    globalCache[key] = val
  }

  function clearGlobal() {
    setGlobalCacheValue('currentMousedownEvent', null)
    setGlobalCacheValue('currentMousedownRef', null)
    setGlobalCacheValue('currentCreateEvent', null)
    setGlobalCacheValue('isDragging', false)
    setGlobalCacheValue('isCreate', false)
    setGlobalCacheValue('draggingEvent', null)
    setGlobalCacheValue('dragSource', null)
  }

  function clear() {
    setMousedownTime(null)
    setMousemoveTime(null)
    setCreateEvent(null)
    setCreateStart(null)
    setDragEvent(null)
  }
  function clearPagePopover() {
    setCreatePopoverRef(null)
    setShowCreatePopover(false)
    setShowNormalPopover(false)
    setNormalPopoverRef(null)
    setNormalEvent(null)
  }
  function clearCreateEvent() {
    setEvents(events.filter((e) => !e.isCreate))
  }
  function clearDragEvent() {
    // isCreate和isDragging 会同时出现在createEvent中
    // 所以相对于dragEvent
    // createEvent就是普通的normalEvent
    const normalEvent = events.filter((e) => e.isCreate || !e.isDragging)
    setEvents(normalEvent)
  }

  const containerMousedown = () => {
    if (!globalCache.currentMousedownEvent) {
      clearPagePopover()
      // 目前无法做到，创建事件。
      // 放下后定位布局，此时点击查看别的事件。
      // 由于去掉了新建事件，发生重绘。
      // 导致了点击出的元素发生变化，从而导致的定位问题

      // 目前的解决方案就是 新建占据大屏
      clearCreateEvent()
    }
  }
  const containerMouseup = () => {
    const normalEvent = events.filter((e) => e.isCreate || !e.isDragging)
    // 如果点击在事件上
    if (globalCache.currentMousedownEvent) {
      if (globalCache.currentMousedownEvent.isCreate) {
        // 如果点击在create时间上结束的
        // 显示createPopover
        setShowCreatePopover(true)
      } else {
        // 如果点击事件是在 normal 事件上结束
        if (!globalCache.isDragging) {
          // 对normal事件执行的是不是拖拽操作功能
          // 显示normalPopover
          setNormalEvent(globalCache.currentMousedownEvent)
          setNormalPopoverRef(globalCache.currentMousedownRef)
          setShowNormalPopover(true)
        } else {
          if (dragEvent) {
            // 这里使用dragSource记录，主要是为了区分createEvent时间上的拖拽
            if (globalCache.dragSource) {
              delete dragEvent?.isDragging
              const index = normalEvent.findIndex((e) => e === globalCache.dragSource)
              normalEvent.splice(
                index, 1, dragEvent
              )
            }
          }

        }

      }
    }
    // 创建事件结束
    setShowCreatePopover(true)
    setEvents(normalEvent)
    clear()
    clearGlobal()
  }

  const createRef = useRef<Element>(null)

  useEffect(() => {
    if (createRef) {
      setCreatePopoverRef(createRef.current)
    } else {
      setCreatePopoverRef(null)
    }
  }, [createRef.current, events])


  return (
    <>
      <CreatePopover />
      <NormalPopover  />
      <div className={styles.mainContainer} onMouseDown={containerMousedown} onMouseUp={containerMouseup}>
        <div className={styles.mainLeft}>
          <SideComponent />
        </div>
        <div className={styles.mainRight}>
          <MenuHeader
            value={value}
            type={type}
            setToday={setValue}
            setType={setType}
            prev={(amount) => move(amount)}
            next={(amount) => move(amount)} />
          {
            type === 'month' ?
              <MonthWrapper
              /> :
              <DayWrapper
                dragEvent={dragEvent}
                setDragEvent={setDragEvent}
                createEvent={createEvent}
                setCreateEvent={setCreateEvent}
                dragTime={dragTime}
                setDragTime={setDragTime}
                mousedownTime={mousedownTime}
                setMousedownTime={setMousedownTime}
                mousemoveTime={mousemoveTime}
                setMousemoveTime={setMousemoveTime}
                createStart={createStart}
                setCreateStart={setCreateStart}
                clearCreateEvent={clearCreateEvent}
                globalCache={globalCache}
                setGlobalCacheValue={setGlobalCacheValue}
                ref={createRef}
              />
          }
        </div>
      </div>
    </>

  )
}
